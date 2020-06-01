
	function genCharArray(charA, charZ) {
	    var a = [], i = charA.charCodeAt(0), j = charZ.charCodeAt(0);
	    for (; i <= j; ++i) {
	        a.push(String.fromCharCode(i));
	    }
	    return a;
	}
	var abc = genCharArray('a', 'z'); 

	function isInArray(a, e) {
	  for ( var i = a.length; i--; ) {
	    if ( a[i] === e ) return true;
	  }
	  return false;
	}

	function isEqArrays(a1, a2) {
	  if ( a1.length !== a2.length ) {
	    return false;
	  }
	  for ( var i = a1.length; i--; ) {
	    if ( !isInArray( a2, a1[i] ) ) {
	      return false;
	    }
	  }
	  return true;
	}

	Array.prototype.unique = function() {
	    var a = this.concat();
	    for(var i=0; i<a.length; ++i) {
	        for(var j=i+1; j<a.length; ++j) {
	            if(a[i] === a[j])
	                a.splice(j--, 1);
	        }
	    }

	    return a;
	};

	// Define the `app` module
	var app = angular.module('app', [], function($interpolateProvider) {
		$interpolateProvider.startSymbol('<%');
		$interpolateProvider.endSymbol('%>');
	});


	var fileReader = function ($q, $log) {

		var onLoad = function(reader, deferred, scope) {
			return function () {
				scope.$apply(function () {
					deferred.resolve(reader.result);
				});
			};
		};

		var onError = function (reader, deferred, scope) {
			return function () {
				scope.$apply(function () {
					deferred.reject(reader.result);
				});
			};
		};

		var onProgress = function(reader, scope) {
			return function (event) {
				scope.$broadcast("fileProgress",
				{
					total: event.total,
					loaded: event.loaded
				});
			};
		};

		var getReader = function(deferred, scope) {
			var reader = new FileReader();
			reader.onload = onLoad(reader, deferred, scope);
			reader.onerror = onError(reader, deferred, scope);
			reader.onprogress = onProgress(reader, scope);
			return reader;
		};

		var readAsText = function (file, scope) {
			var deferred = $q.defer();

			var reader = getReader(deferred, scope);         
			reader.readAsText(file);

			return deferred.promise;
		};

		return {
			readAsText: readAsText  
		};
	};

	app.factory("fileReader",
		["$q", "$log", fileReader]);



	app.controller('AutomataController', function AutomataController($scope, fileReader, $filter) {
		$scope.estados = [];
		$scope.estadosAceptacion = [];
		$scope.alfabeto = [];
		$scope.estadoInicial = [];
		$scope.transiciones = [];
		$scope.afn = [];
		$scope.transD = [];
		$scope.afdEstadoInicio = "";
		$scope.showLambda = false;
		$scope.esCadena = esCadena;
		$scope.cadena = "";
		$scope.esCadenaAceptacion = false;
		$scope.getFile = function() {
			$scope.progress = 0;
			$scope.textSrc = '';
			fileReader.readAsText($scope.file, $scope).then(function(result) {
	            resetForm();
	            $scope.textSrc = result;
	            $scope.estados = obtenerEstados(result, /\s*q\s*:\s*{(.*?)}/sigm);
	            $scope.alfabeto = obtenerEstados(result, /\s*f\s*:\s*{(.*?)}/sigm);
	            $scope.alfabeto.push('e');//lambda
	            $scope.estadosAceptacion = obtenerEstados(result, /\s*a\s*:\s*{(.*?)}/sigm);
	            $scope.estadoInicial = obtenerEstados(result, /\s*i\s*:\s*(.*)/igm);
	            $scope.transiciones = obtenerTransiciones(result, /\s*w\s*:\s*{(.*?)}/sigm);
	            construirAFN();
	            construirAFD();
	            if (!$scope.showLambda) {
	            	$scope.alfabeto.splice(-1, 1);
	            }
	        });
		};


		function obtenerEstados(texto, regex) {
			let m;
			let estados = [];
			while ((m = regex.exec(texto)) !== null) {
			    // Esto es necesario para evitar loops infinitos con zero-width
			    if (m.index === regex.lastIndex) {
			        regex.lastIndex++;
			    } 
			    
			    m.forEach((match, groupIndex) => {
			    	if (groupIndex == 1) {
				        let estadoGrupo = match.split(',');
				    	estadoGrupo.forEach((item, index) => {
				    		estados.push(item.trim());
				    	});
			    	}
			    });
			}
			return estados;
		}

		function obtenerTransiciones(texto, regex) {
			let grupo;
			let transiciones = [];
			let transicionRegex = /\((.*?)\)/sigm;
			while ((grupo = regex.exec(texto)) !== null) {
			    if (grupo.index === regex.lastIndex) {
			        regex.lastIndex++;
			    } 
			    
			    grupo.forEach((match, groupIndex) => {
			    	if (groupIndex == 1) {
			    		let grupoTran;

			    		while ((grupoTran = transicionRegex.exec(match)) !== null) {
			    			if (grupoTran.index === regex.lastIndex) {
			    				regext.lastIndex++;
			    			}

			    			grupoTran.forEach((tranMatch, tranIndex) => {
			    				if ((tranIndex % 2) == 0) {
			    					return false; // continue as it is the main group, is not the transition definition
			    				}
					    		transiciones.push(tranMatch);
			    			});

			    		}
				        
			    	}
			    });
			}
			return transiciones;
		}

		function construirAFN() {
			angular.forEach($scope.estados, function(value) {
				$scope.afn.push({
					identifier: value,
					transiciones: [], 
					estadoInicial: false,
					estadosAceptacion: false
				});
			});
 
			angular.forEach($scope.transiciones, function(transicion) {
				let items = transicion.split(',');
				let singleItems = [];
				items.forEach((item, index) => {
					singleItems.push(item.trim());					
				});

				let origen = $filter('filter')($scope.afn, {identifier: singleItems[0]})[0];	
				if (origen != undefined || origen != null) {
					$scope.alfabeto.forEach((letra, index) => {
						if (origen.transiciones[index] == undefined || origen.transiciones[index] == null) {
							origen.transiciones[index] = [];
						}
						if (singleItems[1] == letra) {
							origen.transiciones[index].push(singleItems[2]);
							if (letra == 'e') {
								$scope.showLambda = true;
							}
						}
					});
				}
				if (origen.identifier == $scope.estadoInicial[0]) {
					origen.estadoInicial = true;
				}
				$scope.estadosAceptacion.forEach((estado, index) => {
					if (origen.identifier == estado) {
						origen.estadosAceptacion = true;
						return true; // break
					}
				});
			});
		}

		function construirAFD() {
			let identifier = "";
			let labda = "e";

			let estado = $scope.afn[0];
			let abcIndex = 0;
			identifier = abc[abcIndex];
			let labdaIndex = $scope.alfabeto.indexOf(labda);
			let composicion = getCompositionLabda([], labdaIndex, estado).unique();
			$scope.transD.push({
				identifier: identifier,
				transiciones: [],
				composicion: composicion,
				estadoAceptacion: esAceptacion(composicion)
			});
			$scope.afdEstadoInicio = identifier;

			let sinMarcar = false;
			let estadosMarcados = 0;

			let index = 0;
			do {
				estadosMarcados++;
				let estadoMarcado = $scope.transD[index];
				$scope.alfabeto.forEach(function (letra, letraIndex) {
					if (letraIndex == labdaIndex) {
						return false;
					}

					let alfaComposicion = [];
					estadoMarcado.composicion.forEach(function (estado, estadoIndex) {
						let compEstado = $filter('filter')($scope.afn, {identifier: estado})[0];
						if (compEstado == undefined) {
							return false;
						}

						if (compEstado.transiciones[letraIndex] != null || compEstado.transiciones[letraIndex] != undefined) {
							compEstado.transiciones[letraIndex].forEach(function (tranLetra, tranIndex) {
								alfaComposicion.push(tranLetra);
							});
						} 
					});

					let labdaComposition = [];
					if (alfaComposicion.length == 0) {
						labdaComposition.push('0');
					} else {
						alfaComposicion.forEach(function (alfa) {
							let alfaEstado = $filter('filter')($scope.afn, {identifier: alfa})[0];
							labdaComposition = labdaComposition.concat(getCompositionLabda([], labdaIndex, alfaEstado)).unique();
						});

						if (labdaComposition.length == 0) {
							labdaComposition.push('0');
						}
					}


					let matchEstado = $filter('filter')($scope.transD, function (value) {
						if (isEqArrays(value.composicion, labdaComposition)) {
							return true;
						} 
						return false;
					});

					if (matchEstado != undefined && matchEstado != null && matchEstado.length > 0) {
						estadoMarcado.transiciones[letraIndex] = matchEstado[0].identifier;
					} else {
						abcIndex += 1;
						identifier = abc[abcIndex];
						$scope.transD.push({
							identifier: identifier,
							transiciones: [],
							composicion: labdaComposition,
							estadoAceptacion: esAceptacion(labdaComposition)
						});

						estadoMarcado.transiciones[letraIndex] = identifier;
					}
				});
				sinMarcar = (estadosMarcados < $scope.transD.length);
				index++;
			} while(sinMarcar);
		}

		function getCompositionLabda(composicion, index, estado) {
			composicion.push(estado.identifier);
			if (estado.transiciones[index] != null || estado.transiciones[index] != undefined) {
				estado.transiciones[index].forEach(function (tranLetra, tranIndex) {
					composicion.push(tranLetra);

					let estadoNuevo = $filter('filter')($scope.afn, {identifier: tranLetra})[0];
					if (estadoNuevo != undefined) {
						return getCompositionLabda(composicion, index, estadoNuevo);
					}
				});	
			}

			return composicion.sort();
		}

		function esAceptacion(composicion) {
			let aceptacion = false;
			$scope.estadosAceptacion.forEach(function (estado) {
				if (isInArray(composicion, estado)) {
					aceptacion = true;
					return true;
				}
			})

			return aceptacion;
		}

		// Verificar si la cadena evaluada cumple con el automata, 
		verificando las transicciones y los estados de aceptacion
		function esCadena() {
			let estadoActual = $scope.transD[0];
			if (estadoActual.estadoAceptacion) {
				$scope.esCadenaAceptacion = true;
			}
			for (var i = 0; i < $scope.cadena.length; i++) {
				let caracter = $scope.cadena.charAt(i);
				if (isInArray($scope.alfabeto, caracter)) {						
					if (estadoActual == null) {
						let estadoActual = $scope.transD[i];
					}
					let caracterIndex = $scope.alfabeto.indexOf(caracter);
					if (estadoActual.transiciones[caracterIndex] != null || estadoActual.transiciones[caracterIndex] != undefined) {
						let destino = estadoActual.transiciones[caracterIndex];
						estadoActual =  $filter('filter')($scope.transD, {identifier: destino})[0];
						
						$scope.esCadenaAceptacion = estadoActual.estadoAceptacion;	
						
					}
				} else {
					$scope.esCadenaAceptacion = false;
				}
			  	
			}
		}
	});






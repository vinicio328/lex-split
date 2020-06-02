// utilidades 
function genCharArray(charA, charZ) {
	var a = [],
		i = charA.charCodeAt(0),
		j = charZ.charCodeAt(0);
	for (; i <= j; ++i) {
		a.push(String.fromCharCode(i));
	}
	return a;
}
var abc = genCharArray('a', 'z');

function isInArray(a, e) {
	for (var i = a.length; i--;) {
		if (a[i] === e) return true;
	}
	return false;
}

function isEqArrays(a1, a2) {
	if (a1.length !== a2.length) {
		return false;
	}
	for (var i = a1.length; i--;) {
		if (!isInArray(a2, a1[i])) {
			return false;
		}
	}
	return true;
}
Array.prototype.unique = function() {
	var a = this.concat();
	for (var i = 0; i < a.length; ++i) {
		for (var j = i + 1; j < a.length; ++j) {
			if (a[i] === a[j]) a.splice(j--, 1);
		}
	}
	return a;
};


(function() {
	'use strict';
	angular.module('app').service('automata', AutomataService);
	// no se inyecta el vm porque no lo necesitamos
	AutomataService.$inject = ['$filter'];

	function AutomataService($filter) {
		var service = this;

		// variables para evaluacion
		service.estados = [];
		service.estadosAceptacion = [];
		service.alfabeto = [];
		service.estadoInicial = [];
		service.transiciones = [];
		service.afn = [];
		service.transD = [];
		service.afdEstadoInicio = "";
		service.showLambda = false;
		service.esCadena = esCadena;
		service.cadena = "";
		service.error = "";
		service.esCadenaAceptacion = false;
		service.automatas = {
			variable: {
				f: ['@var', '@identifier', '@asignador', '@valor', '@comparador', ';'],
				q: [1, 2, 3, 4, 5, 6],
				i: 1,
				a: [6],
				w: [[1, '@var', 2], [1, 'e', 2], [2, '@identifier', 3], [3, '@asignador', 4], [4, '@valor', 5], [4, '@identifier', 5], [5, '@comparador', 4], [5, ';', 6], [3, ';', 6]]
			},
			if: {            	
				f: ['if', '(', ')', '@identifier', '@valor', '@comparador', '{', '}', 'else', '@logico'],
				q: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
				i: 1,
				a: [9, 12],
				w: [[1, 'if', 2], [2, '(', 3], [3, '@identifier', 4], [3, '@valor', 4], [4, '@comparador', 5], [5, '@valor', 6], [5, '@identifier', 6], [6, '@logico', 3], [6, ')', 7], [7, '{', 8], [8, '}', 9], [9, 'else', 10], [10, 'if', 2], [10, '{', 11,], [11, '}', 12]]
			},
			for: {            	
				f: ['for', '(', ')', '@var', '@identifier', '@asignador', '@valor', '@comparador', '{', '}', '++', '--', '@number', ';'],
				q: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
				i: 1,
				a: [17],
				w: [[1, 'for', 2], [2, '(', 3], [3, '@var', 4], [4, '@identifier', 5], [3, '@identifier', 5], [5, '@asignador', 6], [6, '@number', 7], [6, '@identifier', 7], [7, ';', 8], [8, '@identifier', 9], [9, '@comparador', 10], [10, '@number', 11], [10, '@identifier', 11], [11, ';', 12], [12, '@identifier', 13], [13, '++', 14], [13, '--', 14], [14, ')', 15], [15, '{', 16], [16, '}', 17]]
			},
			while: {            	
				f: ['while', '(', ')', '@identifier', '@valor', '@comparador', '{', '}', '@bool'],
				q: [1, 2, 3, 4, 5, 6, 7, 8, 9],
				i: 1,
				a: [9],
				w: [[1, 'while', 2], [2, '(', 3], [3, '@identifier', 4], [4, '@comparador', 5], [5, '@valor', 6], [5, '@bool', 6], [5, '@identifier', 6], [3, '@bool', 6], [6, ')', 7], [7, '{', 8], [8, '}', 9]]
			},
			do: {            	
				f: ['do', 'while', '(', ')', '@identifier', '@valor', '@comparador', '{', '}', '@bool'],
				q: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
				i: 1,
				a: [10],
				w: [[1, 'do', 2], [2, '{', 3], [3, '}', 4], [4, 'while', 5], [5, '(',6], [6, '@identifier', 7], [7, '@comparador', 8], [8, '@valor', 9], [8, '@bool', 9], [8, '@identifier', 9], [6, '@bool', 9], [9, ')', 10]]
			}
		};

		service.validarAutomata = function (automata, tokens) {
			service.afn = [];
			service.transD = [];
			service.estadoInicial = automata.i;
			service.estadosAceptacion = automata.a;
			service.estados = automata.q;
			service.transiciones = automata.w;
			service.alfabeto = automata.f;
			construirAFN();
			construirAFD();
			return esCadena(tokens);
		} 

		// AFN camino simple
		function construirAFN() {
			angular.forEach(service.estados, function(value) {            	
				service.afn.push({
					identifier: value,
					transiciones: [],
					estadoInicial: false,
					estadosAceptacion: false
				});
			});

			angular.forEach(service.transiciones, function(transicion) {
				let identifier =transicion[0];
				let medio = transicion[1] ;
				let destino = transicion[2];

				let origen = $filter('filter')(service.afn, {
					identifier: identifier
				})[0];

				if (origen != undefined || origen != null) {

					if (origen.transiciones[medio] == undefined || origen.transiciones[medio] == null) {
						origen.transiciones[medio] = [];
					}                	
					origen.transiciones[medio].push(destino);
				}

				if (origen.identifier == service.estadoInicial) {
					origen.estadoInicial = true;
				}

				service.estadosAceptacion.forEach((estado, index) => {
					if (origen.identifier == estado) {
						origen.estadosAceptacion = true;
						return true; // break
					}
				});
			});
		}

		// AFD todas las tutas
		function construirAFD() {
			let identifier = "";
			let lambda = "e";
			let estado = service.afn[0];
			let abcIndex = 0;
			identifier = abc[abcIndex];
			let lambdaIndex = service.alfabeto.indexOf(lambda);
			let composicion = getCompositionlambda([], lambda, estado).unique();
			service.transD.push({
				identifier: identifier,
				transiciones: [],
				composicion: composicion,
				estadoAceptacion: esAceptacion(composicion)
			});
			service.afdEstadoInicio = identifier;
			let sinMarcar = false;
			let estadosMarcados = 0;
			let index = 0;
			do {
				estadosMarcados++;
				let estadoMarcado = service.transD[index];
				service.alfabeto.forEach(function(elemento, letraIndex) {
					if (elemento == lambda) {
						return false;
					}
					let alfaComposicion = [];
					estadoMarcado.composicion.forEach(function(estado, estadoIndex) {
						let compEstado = $filter('filter')(service.afn, {
							identifier: estado
						})[0];
						if (compEstado == undefined) {
							return false;
						}
						if (compEstado.transiciones[elemento] != null || compEstado.transiciones[elemento] != undefined) {
							compEstado.transiciones[elemento].forEach(function(destino, tranIndex) {
								alfaComposicion.push(destino);
							});
						}
					});
					let lambdaComposition = [];
					if (alfaComposicion.length == 0) {
						lambdaComposition.push('0');
					} else {
						alfaComposicion.forEach(function(alfa) {
							let alfaEstado = $filter('filter')(service.afn, {
								identifier: alfa
							})[0];
							lambdaComposition = lambdaComposition.concat(getCompositionlambda([], lambda, alfaEstado)).unique();
						});
						if (lambdaComposition.length == 0) {
							lambdaComposition.push('0');
						}
					}
					let matchEstado = $filter('filter')(service.transD, function(value) {
						if (isEqArrays(value.composicion, lambdaComposition)) {
							return true;
						}
						return false;
					});
					if (matchEstado != undefined && matchEstado != null && matchEstado.length > 0) {
						estadoMarcado.transiciones[elemento] = matchEstado[0].identifier;
					} else {
						abcIndex += 1;
						identifier = abc[abcIndex];
						service.transD.push({
							identifier: identifier,
							transiciones: [],
							composicion: lambdaComposition,
							estadoAceptacion: esAceptacion(lambdaComposition)
						});
						estadoMarcado.transiciones[elemento] = identifier;
					}
				});
				sinMarcar = (estadosMarcados < service.transD.length);
				index++;
			} while (sinMarcar);
		}

		function getCompositionlambda(composicion, medio, estado) {
			composicion.push(estado.identifier);
			if (estado.transiciones[medio] != null || estado.transiciones[medio] != undefined) {
				estado.transiciones[medio].forEach(function(destino, tranIndex) {
					composicion.push(destino);
					let estadoNuevo = $filter('filter')(service.afn, {
						identifier: destino
					})[0];
					if (estadoNuevo != undefined) {
						return getCompositionlambda(composicion, medio, estadoNuevo);
					}
				});
			}
			return composicion.sort();
		}

		function esAceptacion(composicion) {
			let aceptacion = false;
			service.estadosAceptacion.forEach(function(estado) {
				if (isInArray(composicion, estado)) {
					aceptacion = true;
					return true;
				}
			})
			return aceptacion;
		}

		// Verificar si la cadena evaluada cumple con el automata, 
		// verificando las transicciones y los estados de aceptacion
		function esCadena(tokens) {
			let estadoActual = service.transD[0];
			let error = "";
			if (estadoActual.estadoAceptacion) {
				service.esCadenaAceptacion = true;
			}
			for (var i = 0; i < tokens.length; i++) {
				let token = tokens[i];

				let convertido = obtenerConvertido(token);

				if (service.alfabeto.includes(convertido)) {
					if (estadoActual == null) {
						let estadoActual = service.transD[i];
					}
					if (estadoActual.transiciones[convertido] != null || estadoActual.transiciones[convertido] != undefined) {
						let destino = estadoActual.transiciones[convertido];
						estadoActual = $filter('filter')(service.transD, {
							identifier: destino
						})[0];
						service.esCadenaAceptacion = estadoActual.estadoAceptacion;
						if (estadoActual.composicion[0] == 0 && esErrorFinal(estadoActual)) {
							error = convertido + ' - <i>' +  token.text + '</i>' ;
							break;
						}
					}
				} else {
					service.esCadenaAceptacion = false;
				}
			}
			service.error = error;
			return service.esCadenaAceptacion;
		}

		function esErrorFinal(estado) {
			let esDiferente = false;
			estado.transiciones.forEach(function(valor, index) {
				if (valor != estado.identifier) {
					esDiferente = true;
					return false;	
				}
			});
			return !esDiferente;
		}

		function obtenerConvertido(token) {
			if (token.noConvert) {
				return token.text;
			}

			if (token.text == ';') {
				return ';';
			}

			if (token.isReserved) {
				return "@var";
			}
			else if (token.isString || token.isBool || token.isNumber) {
				if (token.forceNumber) {
					return '@number';
				}
				if (token.forceBool) {
					return '@bool';
				}
				return '@valor';
			}
			else if (token.isVariable) {
				return "@identifier";
			}
			else if (token.isAssign) {
				return '@asignador';
			}        	
			else if (token.isLogical) {
				return '@logico';
			}
			else if (token.isOperator) {
				return '@comparador';
			}
			else if (token.isSimbol) {
				return '@fin';
			}
			else if (token.isUnknown) {
				return '@unknown';
			}
		}
	}
})();
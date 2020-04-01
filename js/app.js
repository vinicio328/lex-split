// app in strict mode for safely
(function() {

	'use strict';

	angular.module('app', []);
	angular.module('app').controller('EditorController', EditorController);

  	// no se inyecta el $scope porque no lo necesitamos
  	EditorController.$inject = ['lenguaje'];

  	function EditorController(lenguaje) {	
	
		// assigning this to a loacal variable makes it easier to 
		// declare properties and methods in the controller
		var vm = this;
		
		// declarar variables del controlador
		vm.tokens = [];
		vm.lenguaje = "js"
		vm.codigo = ""; // codigo pegado en el text-area
		vm.CambioEnEditor = function CambioEnEditor() {			
			var arrayDeLineas = vm.codigo.match(/[^\r\n]+/g);
			vm.tokens = procesarLineas(arrayDeLineas);	
		}

		vm.CambioDeLenguaje = function CambioDeLenguaje() {
			CambiarEntorno(vm.lenguaje)
		}

		function CambiarEntorno(lenguaje) {
			// body...
		}


		// no controller actions
		function procesarLineas(lineas) {
			var tokenEnLineas = [];

			// separar linea por linea
			for (var lineaIndex = 0; lineaIndex < lineas.length; lineaIndex++) {
				var lineaActual = lineas[lineaIndex];
				console.log(lineaActual);				

				var esSeparador = false;
				var esToken = false;
				var tokenActual = "";
				var vieneDeOperador = false;
				// Ir caracter por caracter en la linea hasta encontrar un separador
				for (var caracterIndex = 0; caracterIndex < lineaActual.length; caracterIndex++) {
					var caracterActual = lineaActual[caracterIndex];
				  	// TODO agregar soporte para no-token comom comentario o final de linea
				  	if (/\s/.test(caracterActual)) { // verifica si el caracter no es un espacio en blanco
				  		if (tokenActual.length == 0) {
				  			continue;
				  		}
				  		else {
				  			esSeparador = true;
				  			tokenEnLineas.push(tokenActual);
				  			tokenActual = ""; // reset al token ya que se encontro un separador
				  		}
				  	} else {
				  		if (lenguaje.separador.includes(caracterActual)) {
				  			if (!vieneDeOperador && tokenActual.length > 0) {
				  				tokenEnLineas.push(tokenActual);				  			
				  				tokenActual ="";
				  			}

				  			// if (!lenguaje.noToken.includes(caracterActual)) {
				  			// 	tokenEnLineas.push(caracterActual);				  				
				  			// } else 
				  			if (lenguaje.separadorCombinado.includes(caracterActual)) {
				  				tokenActual += caracterActual;				  				
				  				vieneDeOperador = true;
				  			} else {
				  				tokenEnLineas.push(caracterActual);
				  				vieneDeOperador = false;
				  			}

				  		} else {
				  			vieneDeOperador = false;
					  		esSeparador = false;
					  		tokenActual += caracterActual;
				  		}
				  	}

				}

				// Agregar el token al arreglo si es el token final, ya que no hay ningun separador final
				if (tokenActual.length > 0) {
					tokenEnLineas.push(tokenActual);
					tokenActual = "";
				}

			}
			console.log(tokenEnLineas);
			return tokenEnLineas;			
		}
	}

})();




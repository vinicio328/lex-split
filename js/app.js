// app in strict mode for safely
(function() {

	'use strict';

	angular.module('app', []);
	angular.module('app').controller('EditorController', EditorController);

  // no se inyecta el $scope porque no lo necesitamos
  EditorController.$inject = [];

  function EditorController() {	
	
		// assigning this to a loacal variable makes it easier to 
		// declare properties and methods in the controller
		var vm = this;
		
		// declarar variables del controlador
		vm.tokens = [];
		vm.codigo = ""; // codigo pegado en el text-area
		vm.CambioEnEditor = function CambioEnEditor() {			
			var arrayDeLineas = vm.codigo.match(/[^\r\n]+/g);
			vm.tokens = procesarLineas(arrayDeLineas);	
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

				// Ir caracter por caracter en la linea hasta encontrar un separador
				for (var caracterIndex = 0; caracterIndex < lineaActual.length; caracterIndex++) {
					var caracterActual = lineaActual[caracterIndex];
				  	// TODO agregar soporte para no-token comom comentario o final de linea
				  	if (/\s/.test(caracterActual)) {
				  		if (tokenActual.length == 0) {
				  			continue;
				  		}
				  		else {
				  			esSeparador = true;
				  			tokenEnLineas.push(tokenActual);
				  			tokenActual = ""; // reset al token ya que se encontro un separador
				  		}
				  	} else {
				  		esSeparador = false;
				  		tokenActual += caracterActual;
				  	}

				}

				// Agregar el token al arregle si es el token final, ya que no hay ningun separador final
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




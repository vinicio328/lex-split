// app in strict mode for safely
(function() {

	'use strict';

	angular.module('app').service('lenguaje', LenguajeService);

  	// no se inyecta el $scope porque no lo necesitamos
  	LenguajeService.$inject = [];

  	function LenguajeService() {	
  		this.noToken = "";
  		this.separador = [',', '.', '+', '-', '/', '*', '='];
  		this.literales = ['\'', '"'];
  		this.comentarios = {
  			single: "//",
  			multiple: "/*",
  			finalMultiple: "*/"
  		};

  		this.cambiarLenguaje(lenguaje) {
  			 
  		}

		this.expresiones = {
			js : {

			},
			csahrp : {

			}
		};
	}




})();




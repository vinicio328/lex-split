// app in strict mode for safely
(function() {

	'use strict';

	angular.module('app').service('lenguaje', LenguajeService);

  	// no se inyecta el $scope porque no lo necesitamos
  	LenguajeService.$inject = [];

  	function LenguajeService() {	
  		this.separador = [';', ':', ',', '.', '+', '-', '/', '*', '=', '>', '<'];
  		this.separadorCombinado = ['+', '-', '=', '>', '<'];
  		this.noToken = [',', '.'];
  		this.literales = ['\'', '"'];
  		this.comentarios = {
  			single: "//",
  			multiple: "/*",
  			finalMultiple: "*/"
  		};

  		this.cambiarLenguaje =  function(lenguaje) {
  			 
  		};

		this.expresiones = {
			js : {

			},
			csahrp : {

			}
		};
	}




})();




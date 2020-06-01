// app in strict mode for safely
(function() {
	'use strict';
	angular.module('app').service('lenguaje', LenguajeService);
	// no se inyecta el $scope porque no lo necesitamos
	LenguajeService.$inject = [];

	function LenguajeService() {
		this.argumento = ",";
		this.propiedad = ".";
		this.abrirMetodo = "(";
		this.cerrarMetodo = ")";
		this.abrirBloque = "{";
		this.cerrarBloque = "}";
		this.asignador = ['=', '+=', '-='];
		this.separador = [';', ':', ',', '.', '+', '-', '/', '*', '=', '>', '<'];
		this.separadorCombinado = ['+', '-', '=', '>', '<'];
		this.operador = ['+', '-', '/', '*', '=', '>', '<', '>=', '<=', '==', '!=', '++', '+=', '-=', '--'];
		this.logical = ['&&', '||'];
		this.noToken = [',', '.'];
		this.literales = ['\'', '"'];
		this.finDeLinea = ';';
		this.comentarios = {
			single: "//",
			multiple: "/*",
			finalMultiple: "*/"
		};
		this.reservadas = ['break', 'case', 'class', 'catch', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'else', 'export', 'extends', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 'let', 'new', 'return', 'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield', 'enum', 'implements', 'package', 'protected', 'static', 'interface', 'private', 'public', 'abstract', 'boolean', 'byte', 'char', 'double', 'final', 'float', 'goto', 'int', 'long', 'native', 'short', 'synchronized', 'transient', 'volatile'];
		this.variable = ['let', 'var'];
		this.cambiarLenguaje = function(lenguaje) {};
		this.expresiones = {
			js: {},
			csahrp: {}
		};
	}
})();
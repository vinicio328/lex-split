// app in strict mode for safely
(function() {

	'use strict';

	angular.module('app', []);
	angular.module('app').controller('EditorController', EditorController);

  // no need to inject $scope because we don't need it
  EditorController.$inject = [];

  function EditorController() {
	
		// assigning this to a loacal variable makes it easier to 
		// declare properties and methods in the controller
		var vm = this;
		
		// declare our variables
		vm.title = "Compiladores!";
		vm.tokens = [];
		vm.code = ""; // actual the code pasted in the editor-textarea
		vm.OnEditorChange = function OnEditorChange() {			
			var arrayOfLines = vm.code.match(/[^\r\n]+/g);
			vm.tokens = processLines(arrayOfLines);	
		}


		// no controller actions
		function processLines(lines) {
			var localTokens = [];

			// first split by lines
			for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) {
				var actualLine = lines[lineIndex];
				console.log(actualLine);
				// go for each char in the line

				var isSeparator = false;
				var isToken = false;
				var localToken = "";
				for (var charIndex = 0; charIndex < actualLine.length; charIndex++) {
					var actualChar = actualLine[charIndex];
				  	// TODO add support for no token like comment and end line
				  	if (/\s/.test(actualChar)) {
				  		if (localToken.length == 0) {
				  			continue;
				  		}
				  		else {
				  			isSeparator = true;
				  			localTokens.push(localToken);
				  			localToken = ""; // reset as the token is already added to the array
				  		}
				  	} else {
				  		isSeparator = false;
				  		localToken += actualChar;
				  	}

				}
				if (localToken.length > 0) {
					localTokens.push(localToken);
					localToken = "";
				}
			}
			console.log(localTokens);
			return localTokens;			
		}
	}

})();




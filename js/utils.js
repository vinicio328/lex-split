
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
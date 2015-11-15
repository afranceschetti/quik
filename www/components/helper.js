var Helpers = Helpers || {};

Helpers.util = {
	isStringEmpty : function(str) {
		return (!str || 0 === str.length);
	},

	getRandomIndices : function(resultSize, maxRange) {
		var result = [];
		while (result.length < resultSize) {
			var randomnumber = Math.ceil(Math.random() * (maxRange));
			var found = false;
			for (var i = 0; i < result.length; i++) {
				if (result[i] == randomnumber) {
					found = true;
					break;
				}
				;
			}
			if (!found)
				result[result.length] = randomnumber;
		}
		return result;
	},
	shuffleArray : function(o) {
		for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
			;
		return o;
	},
	readFromLocalStore : function(localStorageService, key, default_value){
		var result  = localStorageService.get(key);
		if(result == null) 
			result = localStorageService.cookie.get(key);
		if(default_value && result==null)
			result = default_value;
		return result;
	}, 
	
	writeToLocalStore : function(localStorageService, key, value){
		if(localStorageService.isSupported) 
			localStorageService.set(key,value);
		else
			localStorageService.cookie.set(key,value);
	},
	removeFromLocalStore : function(localStorageService, key){
		if(localStorageService.isSupported) 
			localStorageService.remove(key);
		else
			localStorageService.cookie.remove(key);
	},
	covertTimeToElapsed: function(time){
		var result = "";
		if(time && time!=null){
			var x = time / 1000;
			var seconds = (x % 60).toFixed(0);
			x /= 60;
			var minutes = (x % 60).toFixed(0);
			x /= 60;
			var hours = (x % 24).toFixed(0);
			x /= 24;
			var days = x.toFixed(0);;
			if(days>0)
				result  += " " + days + " days";
			if(hours>0)
				result  += " " + hours + " h";
			if(minutes>0)
				result  += " " + minutes + " min";
			if(seconds>0)
				result  += " " + seconds + " sec";
		}
		return result;
	},
	sortBy: function(field, reverse, primer){
		var key = primer ? 
			function(x) {return primer(x[field]);} : 
			function(x) {return x[field];};

		reverse = !reverse ? 1 : -1;

		return function (a, b) {
			   return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
		}; 
	}
};

Helpers.dom = {
	drawPoint : function(Y, X, color) {
		$("body").append(
				$('<div>' + X + ':' + Y + '</div>').css('position', 'absolute').css('top', Y + 'px').css('left', X + 'px').css('width', "10px").css('height',
						"10px").css('background-color', color));
	}
};

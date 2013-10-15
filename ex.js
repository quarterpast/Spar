Function.prototype.methods = function(inst, stat) {
	for(var p in inst) if (inst.hasOwnProperty(p)) {
		this.prototype[p] = inst[p];
	}

	for(var p in stat) if (stat.hasOwnProperty(p)) {
		this[p] = stat[p];
	}

	return this;
};

Function.methods({
	extends: function(sup) {
		function fun(){}
		for(var p in sup) if (sup.hasOwnProperty(p)) {
			this[p] = sup[p];
		}
		fun.prototype = sup.prototype;
		this.prototype = new fun;
		this.prototype.superclass = sup;
		this.prototype.constructor = this;
		if (typeof sup.extended == 'function') {
			sup.extended(this);
		}

		return this;
	},
	abstract: function() {
		var methods = [].slice.call(arguments),
		    obj = {};

		methods.forEach(function (method) {
			obj[method] = function(str) {
				throw new TypeError(method+' is abstract');
			}
		});
		return this.methods(obj);
	}
});
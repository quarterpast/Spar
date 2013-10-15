const TokenFactory = require('./token').TokenFactory;
require('./ex');

var Tokeniser = (function(factories) {
	this.factories = factories;
}).methods({
	match: function(str) {
		var f, m;
		for(var i = 0, l = this.factories.length; i < l; i++) {
			f = this.factories[i];
			m = f.match(str)
			if(m) {
				return [f.create(m), f.remain(str, m)];
			}
		}
	},

	lex: function(str) {
		var a, out = [];
		while(a = this.match(str)) {
			str = a[1];
			out = out.concat(a[0]);
		}
		if(str.length) throw new SyntaxError(str);
		return out;
	}
});
exports.Tokeniser = Tokeniser;

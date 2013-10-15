require('./ex');

var Token = exports.Token = (function (name, match) {
	this.name = name;
	this.match = match;
}).methods({
	toString: function() {
		return this.match;
	}
});

var TokenFactory = exports.TokenFactory = (function (name) {
	this.name = name;
}).methods({
	create: function(match) {
		return new Token(this.name, match);
	}
}, {
	simple: function() {
		return (function (name, spec) {
			this.superclass.call(this, name);
			this.spec = spec;
		}).extends(TokenFactory);
	}
})
.abstract('match', 'remain');

var StringTokenFactory = exports.StringTokenFactory = TokenFactory.simple().methods({
	match: function(str) {
		return str.slice(0,this.spec.length) === this.spec;
	},
	remain: function(str, match) {
		return str.slice(this.spec.length);
	}
});

var RegexTokenFactory = exports.RegexTokenFactory = TokenFactory.simple().methods({
	match: function(str) {
		var match = this.spec.exec(str);
		if(match && match.index === 0) {
			return match;
		}
	},
	remain: function(str, match) {
		return str.slice(match[0].length);
	}
});


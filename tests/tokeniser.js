var t = require("../token");

"Token".should({
	"have a sensible toString": function() {
		var tok = new t.Token('test', 'match string');
		assert(tok.toString() === 'match string');
	}
});

"TokenFactory".should({
	"create tokens": function() {
		var f = new t.TokenFactory('test')
		    tok = f.create('match');

		assert(tok instanceof t.Token);
		assert(tok.name === 'test');
		assert(tok.match === 'match');
	},
	"has abstract match and remain methods": function() {
		var f = new t.TokenFactory('test');
		assert.throws(f.match, TypeError);
		assert.throws(f.remain, TypeError);
	},
	"provide a way to subclass with a spec": function() {
		var Fact = t.TokenFactory.simple(),
		    f = new Fact('test','spec');

		assert(f.name === 'test');
		assert(f.spec === 'spec');
	}
});

"StringTokenFactory".should({
	"match an exact string at the start": function() {
		var f = new t.StringTokenFactory('test', 'spec');
		assert(f.match('spec'));
	},
	"not match a not match": function() {
		var f = new t.StringTokenFactory('test', 'spec');
		assert(!f.match('notspec'));
	},
	"have the rest of the string as remain": function() {
		var f = new t.StringTokenFactory('test', 'spec');
		assert(f.remain('spec thing') === ' thing');
	}
});

"RegexTokenFactory".should({
	"match a match at the start": function() {
		var f = new t.RegexTokenFactory('test', /spec/);
		assert(f.match('spec'));
	},
	"not match a not match": function() {
		var f = new t.RegexTokenFactory('test', /spec/);
		assert(!f.match('rsntsrnt'));
	},
	"have the rest as remain": function() {
		var f = new t.RegexTokenFactory('test', /spec/);
		assert(f.remain('spec thing',['spec']) === ' thing');
	}
});

var l = require('../lexer');

"Tokeniser".should({
	"store factories": function() {
		var tok = new l.Tokeniser('factories');
		assert(tok.factories === 'factories');
	},
	"find a matching token": function() {
		var tok = new l.Tokeniser([
			new t.StringTokenFactory('a','a'),
			new t.StringTokenFactory('b','b')
		]),
		m = tok.match('ab');

		assert(m[0].name === 'a');
		assert(m[1] === 'b');
	},
	"lex until it can't": function() {
		var tok = new l.Tokeniser([
			new t.StringTokenFactory('a','a'),
			new t.StringTokenFactory('b','b')
		]), str = "ababbabababababab", tokens = tok.lex(str);

		assert(tokens.length === str.length);
	}
})
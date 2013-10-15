function Parser(rules) {
	var tokens, top = rules.call({
		x: function(name) {
			var got = tokens[0];
			if(got.name != name) throw "expected "+name+" got "+got.name+ " at "+tokens

			return tokens.shift();
		},

		e: function(name) {
			var p = this;
			return function() {
				return p.x(name);
			}
		},

		or: function() {
			var fns = [].slice.apply(arguments), fn, ex = true, res;

			while(ex && (fn = fns.shift())) {
				try {
					res = fn();
					ex = null;
				} catch(e) {
					ex = e;
				}
			}

			if(ex && fns.length == 0) throw ex;
			return res;
		},

		seq: function() {
			var fns = [].slice.apply(arguments), fn, res = [];

			while(fn = fns.shift()) {
				res.push(fn());
			}

			return res;
		},

		star: function(fn) {
			var res = [], r;

			try {
				while(r = fn()) {
					res.push(r);
				}
			} finally {
				return res;
			}
		},

		plus: function(fn) {
			var r = fn();
			return [r].concat(this.star(fn));
		}
	});

	return function(t) {
		tokens = t;
		var out = top();
		if(tokens.length) throw "expected EOF got "+tokens[0].name;
		return out;
	}
}

exports.Parser = Parser;
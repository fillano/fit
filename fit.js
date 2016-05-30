if(module) module.exports = fit;
function fit(str, pre) {
	if(!String.prototype.trim) {
		String.prototype.trim = function() {
			return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
		}
	}
	var oplist = [
		'=',
		'for',
		'endfor',
		'if',
		'else',
		'endif'
	];
	var exp = {
		"=": function(_exp) {
			return function(data) {
				var e = _exp.substr(1).trim().substr(1).split('.');
				return e.reduce(function(pre, cur) {
					return pre[cur];
				}, data);
			};
		},
		"for": function(_exp, _param) {
			var e = _exp.substr(3).trim().split('as');
			var e1 = e[0].trim().substr(1).split('.');
			var e2 = e[1].trim().substr(1);
			return function(data) {
				var s = e1.reduce(function(pre, cur) {
					return pre[cur];
				}, data);
				var ret = '';
				if(!!s) {
					s.forEach(function(item, index) {
						var p = {};
						p[e2] = item;
						p[e2]['index'] = index;
						ret += _param.reduce(function(pre, cur) {
							if(typeof cur === 'function') {
								return pre + cur(p);
							} else {
								return pre + cur;
							}
						}, '');
					});
				}
				return ret;
			};
		},
		"if": function(_exp, _param, _else) {
			var e = _exp.substr(2).trim();
			return function(data) {
				e = e.replace(/\$/g, 'data.');
				var s = eval(e)? _param : _else;
				if(!s) return '';
				return s.reduce(function(pre, cur) {
					if(typeof cur === 'function') {
						return pre + cur(data);
					} else {
						return pre + cur;
					}
				}, '');
			};
		}
	};
	function tokenizer(str) {
		var l_del = '{{';
		var r_del = '}}';
		var part1 = str.split(l_del);
		return part1.reduce(function(pre, cur) {
			if(cur.indexOf(r_del) > -1) {
				var tmp = cur.split(r_del);
				pre.push('{{OP_' + tmp[0].trimLeft());
				pre.push(tmp[1]);
				return pre;
			} else {
				pre.push(cur);
				return pre;		
			}
		}, []);
	}
	function parser(arr) {
		var ret = [];
		var ps = [];
		arr.forEach(function(cur) {
			if(cur.indexOf('{{OP_') === 0) {
				var _exp = cur.substr(5);
				var _op = _exp.trim().split(/ |\$/)[0];
				if(oplist.indexOf(_op) > -1) {
					switch(_op) {
						case '=':
							if(ps.length > 0) {
								if(!!ps[ps.length-1]['else']) {
									ps[ps.length-1]['else'].push(exp['='](_exp));
								} else {
									ps[ps.length-1].param.push(exp['='](_exp));
								}
							} else {
								ret.push(exp['='](_exp));
							}
							break;
						case 'for':
							ps.push({exp: _exp, param: []});
							break;
						case 'endfor':
							var e = ps.pop();
							if(ps.length > 0) {
								ps[ps.length-1].param.push(exp['for'](e.exp, e.param));
							} else {
								ret.push(exp['for'](e.exp, e.param));
							}
							break;
						case 'if':
							ps.push({exp: _exp, param: []});
							break;
						case 'else':
							ps[ps.length-1]['else'] = [];
							break;
						case 'endif':
							var e = ps.pop();
							if(ps.length > 0) {
								if(!!ps[ps.length-1]['else']) {
									ps[ps.length-1]['else'].push(exp['if'](e.exp, e.param, e['else']));
								} else {
									ps[ps.length-1].param.push(exp['if'](e.exp, e.param, e['else']));
								}
							} else {
								ret.push(exp['if'](e.exp, e.param, e['else']));
							}
							break;
					}
				} else {
					if(ps.length > 0) {
						if(!!ps[ps.length-1]['else']) {
							!!ps[ps.length-1]['else'].push('{{unknown('+_op+')}}')
						} else {
							ps[ps.length-1].param.push('{{unknown('+_op+')}}');
						}
					} else {
						ret.push('{{unknown('+_op+')}}');
					}
				}
			} else {
				if(ps.length > 0) {
					if(!!ps[ps.length-1]['else']) {
						ps[ps.length-1]['else'].push(cur);
					} else {
						ps[ps.length-1].param.push(cur);
					}
				} else {
					ret.push(cur);
				}
			}
		});
		if(ps.length > 0) throw '`for` or `if` statement not terminated.';
		return ret;
	}
	function render(parsed, data) {
		return parsed.reduce(function(pre, cur) {
			if(typeof cur === 'function') {
				return pre + cur(data);
			} else {
				return pre + cur;
			}
		}, '');
	}
	var parsed;
	if(!!pre) {
		parsed = parser(tokenizer(str));
	}
	return function(data) {
		if(parsed === undefined) {
			parsed = parser(tokenizer(str));
		}
		return render(parsed, data);
	};
}

/*
Copyright (c) 2016 by Hsu Ping Feng <fillano.feng@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

"use strict";
(function() {
	var root = this;
	var old_fit;
	if(typeof exports !== 'undefined') {
		if(typeof module !== 'undefined' && !!(module.exports)) {
			exports = module.exports = fit;
		}
		exports.fit = fit;
	} else {
		old_fit = root.fit;
		root.fit = fit;
		fit.noConflict = function() {
			root.fit = old_fit;
			return fit;
		};
	}
	function fit(str, opts) {
		if('function' !== typeof String.prototype.trim) {
			String.prototype.trim = function trim() {
				return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
			}
		}
		if('function' !== String.prototype.trimLeft) {
			String.prototype.trimLeft = function trimLeft() {
				return this.replace(/^[\s\uFEFF\xA0]+/g, '');
			}
		}
		var options = {
			l_del: '{{',
			r_del: '}}',
			pre: 'yes',
			async: 'no'
		}
		if(!!opts) {
			options.l_del = opts.l_del || '{{';
			options.r_del = opts.r_del || '}}';
			options.pre = opts.pre ? (opts.pre === 'yes' || opts.pre === 'no') ? opts.pre : 'yes' : 'yes';
			options.async = opts.async ? (opts.pre === 'yes' || opts.pre === 'no') ? opts.async : 'no' : 'no';
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
					var e = _exp.substr(1).trim();
					e = e.replace(/\$/g, 'data.');
					return eval(e);
				};
			},
			"for": function(_exp, _param) {
				var e = _exp.substr(3).trim().split('as');
				var e1 = e[0].trim().substr(1);
				var e2 = e.length < 2 ? '_i' : e[1].trim().substr(1);
				return function(data, global) {
					var s = e1.split('.').reduce(function(pre, cur) {
						return pre[cur];
					}, data);
					var s1 = e1.substr(0, e1.lastIndexOf('.')).split('.').reduce(function(pre, cur) {
						return pre[cur];
					}, data);
					var ret = '';
					s.forEach(function(item, index) {
						var p = {};
						if(item === null || typeof item === 'undefined' || typeof item === 'symbol' || (typeof item !== 'object' && typeof item !== 'function')) {
							p[e2] = {};
							p[e2].toString = function() {return item===null?'null':(typeof item === 'undefined')?'undefined':item.toString()};
						} else {
							p[e2] = item;
						}
						p[e2]['_index'] = index;
						p[e2]['_global'] = global;
						p[e2]['_parent'] = s1;
						ret += _param.reduce(function(pre, cur) {
							if(typeof cur === 'function') {
								if(cur.length == 2) {
									return pre + cur(p, global);	
								} else {
									return pre + cur(p);
								}
							} else {
								return pre + cur;
							}
						}, '');
					});
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
							if(cur.length === 2) {
								return pre + cur(data, data);
							} else {
								return pre + cur(data);
							}
						} else {
							return pre + cur;
						}
					}, '');
				};
			}
		};
		var parsed;
		if(options.pre === 'yes') {
			parsed = parse(tokenize(str));
		}
		function tokenize(str) {
			var part1 = str.split(options.l_del);
			return part1.reduce(function(pre, cur) {
				if(cur.indexOf(options.r_del) > -1) {
					var tmp = cur.split(options.r_del);
					pre.push(options.l_del + 'OP_' + tmp[0].trimLeft());
					pre.push(tmp[1]);
					return pre;
				} else {
					pre.push(cur);
					return pre;		
				}
			}, []);
		}
		function parse(arr) {
			var ret = [];
			var ps = [];
			arr.forEach(function(cur) {
				if(cur.indexOf(options.l_del + 'OP_') === 0) {
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
									if(!!ps[ps.length-1]['else']) {
										ps[ps.length-1]['else'].push(exp['for'](e.exp, e.param));
									} else {
										ps[ps.length-1].param.push(exp['for'](e.exp, e.param));
									}
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
								!!ps[ps.length-1]['else'].push(options.l_del + 'unknown('+_op+')' + options.r_del)
							} else {
								ps[ps.length-1].param.push(options.l_del + 'unknown('+_op+')' + options.r_del);
							}
						} else {
							ret.push(options.l_del + 'unknown('+_op+')' + options.r_del);
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
					if(cur.length === 2) {
						return pre + cur(data, data);
					} else {
						return pre + cur(data);
					}
				} else {
					return pre + cur;
				}
			}, '');
		}
		return function(data, cb) {
			if(options.async === 'yes' && 'function' === typeof cb) {
				setTimeout(function() {
					cb(render(parsed? parsed : parse(tokenize(str)), data));
				}, 0);
			} else {
				return render(parsed? parsed : parse(tokenize(str)), data);
			}
		};
	}
}).call(this);

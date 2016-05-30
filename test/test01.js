var assert = require('chai').assert;
var t = require('../fit');
describe('ft template engine tests', function() {
	it('assign', function(done) {
		var expect = '<div>fillano</div>';
		var s = [
			'<div>{{=$name}}</div>',
			'<div>{{ =$name}}</div>',
			'<div>{{=$name }}</div>',
			'<div>{{= $name}}</div>',
			'<div>{{ = $name}}</div>',
			'<div>{{ =$name }}</div>',
			'<div>{{= $name }}</div>',
			'<div>{{ = $name }}</div>'
		];
		s.forEach(function(s1) {
			assert.equal(expect, t(s1)({name:'fillano'}));
		})
		done();
	});
	it('for', function(done) {
		var expect = '<body><div>name1</div><div>name2</div><div>name3</div></body>';
		var s = [
			'<body>{{for $names as $name}}<div>{{=$name.name}}</div>{{endfor}}</body>',
			'<body>{{ for $names as $name}}<div>{{ = $name.name}}</div>{{endfor}}</body>',
			'<body>{{for $names as $name }}<div>{{ =$name.name }}</div>{{endfor}}</body>',
			'<body>{{ for $names as $name }}<div>{{ = $name.name }}</div>{{endfor}}</body>',
			'<body>{{for $names as $name}}<div>{{= $name.name}}</div>{{ endfor}}</body>',
			'<body>{{for $names as $name}}<div>{{=$name.name }}</div>{{endfor }}</body>',
			'<body>{{for $names as $name}}<div>{{ =$name.name}}</div>{{ endfor }}</body>'
		];
		s.forEach(function(s1) {
			assert.equal(expect, t(s1)({names: [{name:'name1'},{name:'name2'},{name:'name3'}]}));
		});
		done();
	});
	it('if, and index in for', function(done) {
		var expect = '<body><div style="color:red">name1</div><div style="color:green">name2</div><div style="color:red">name3</div></body>';
		var s = [
			'<body>{{for $names as $name}}<div {{if $name.index % 2 === 0}}style="color:red"{{else}}style="color:green"{{endif}}>{{=$name.name}}</div>{{endfor}}</body>',
			'<body>{{for $names as $name}}<div {{ if $name.index % 2 === 0}}style="color:red"{{ else}}style="color:green"{{endif}}>{{=$name.name}}</div>{{endfor}}</body>',
			'<body>{{for $names as $name}}<div {{if $name.index % 2 === 0 }}style="color:red"{{else }}style="color:green"{{endif}}>{{=$name.name}}</div>{{endfor}}</body>',
			'<body>{{for $names as $name}}<div {{ if $name.index % 2 === 0 }}style="color:red"{{ else }}style="color:green"{{ endif }}>{{=$name.name}}</div>{{endfor}}</body>',
			'<body>{{for $names as $name}}<div {{if  $name.index % 2 === 0}}style="color:red"{{else}}style="color:green"{{endif }}>{{=$name.name}}</div>{{endfor}}</body>',
			'<body>{{for $names as $name}}<div {{if $name.index%2===0}}style="color:red"{{else}}style="color:green"{{ endif}}>{{=$name.name}}</div>{{endfor}}</body>',
			'<body>{{for $names as $name}}<div {{if $name.index% 2=== 0 }}style="color:red"{{else}}style="color:green"{{endif}}>{{=$name.name}}</div>{{endfor}}</body>'
		];
		s.forEach(function(s1) {
			assert.equal(expect, t(s1)({names: [{name:'name1'},{name:'name2'},{name:'name3'}]}));
		});
		done();
	});
	it('for in for', function(done) {
		var expect = '<body><div><h3>name1</h3><div>child1-1</div><div>child1-2</div><div>child1-3</div></div><div><h3>name2</h3><div>child2-1</div><div>child2-2</div><div>child2-3</div></div><div><h3>name3</h3><div>child3-1</div><div>child3-2</div><div>child3-3</div></div></body>';
		var s = '<body>{{for $people as $person}}<div><h3>{{=$person.name}}</h3>{{for $person.children as $child}}<div>{{=$child.name}}</div>{{endfor}}</div>{{endfor}}</body>';
		var data = {
			people: [
				{
					name: 'name1',
					children: [
						{name: 'child1-1'},
						{name: 'child1-2'},
						{name: 'child1-3'}
					]
				},
				{
					name: 'name2',
					children: [
						{name: 'child2-1'},
						{name: 'child2-2'},
						{name: 'child2-3'}
					]
				},
				{
					name: 'name3',
					children: [
						{name: 'child3-1'},
						{name: 'child3-2'},
						{name: 'child3-3'}
					]
				},
			]
		};
		assert.equal(expect, t(s)(data));
		done();
	});
	it('if failed', function(done) {
		var expect = '<div></div>';
		var s = '<div>{{if false}}{{=$name}}{{endif}}</div>';
		var data = {name: 'okbyme'};
		assert.equal(expect, t(s)(data));
		done();
	});
});

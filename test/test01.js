var assert = require('chai').assert;
var t = require('../fit');
describe('fit template engine tests', function() {
	it('assign', function() {
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
	});
	it('assign with complex expression', function() {
		var expect = '<div>lastname, firstname</div>';
		var s = '<div>{{=$name[1]}}, {{=$name[0]}}</div>';
		var data = {name: ['firstname', 'lastname']};
		assert.equal(expect, t(s)(data));
	});
	it('for', function() {
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
	});
	it('if, and index in for', function() {
		var expect = '<body><div style="color:red">name1</div><div style="color:green">name2</div><div style="color:red">name3</div></body>';
		var s = [
			'<body>{{for $names as $name}}<div {{if $name._index % 2 === 0}}style="color:red"{{else}}style="color:green"{{endif}}>{{=$name.name}}</div>{{endfor}}</body>',
			'<body>{{for $names as $name}}<div {{ if $name._index % 2 === 0}}style="color:red"{{ else}}style="color:green"{{endif}}>{{=$name.name}}</div>{{endfor}}</body>',
			'<body>{{for $names as $name}}<div {{if $name._index % 2 === 0 }}style="color:red"{{else }}style="color:green"{{endif}}>{{=$name.name}}</div>{{endfor}}</body>',
			'<body>{{for $names as $name}}<div {{ if $name._index % 2 === 0 }}style="color:red"{{ else }}style="color:green"{{ endif }}>{{=$name.name}}</div>{{endfor}}</body>',
			'<body>{{for $names as $name}}<div {{if  $name._index % 2 === 0}}style="color:red"{{else}}style="color:green"{{endif }}>{{=$name.name}}</div>{{endfor}}</body>',
			'<body>{{for $names as $name}}<div {{if $name._index%2===0}}style="color:red"{{else}}style="color:green"{{ endif}}>{{=$name.name}}</div>{{endfor}}</body>',
			'<body>{{for $names as $name}}<div {{if $name._index% 2=== 0 }}style="color:red"{{else}}style="color:green"{{endif}}>{{=$name.name}}</div>{{endfor}}</body>'
		];
		s.forEach(function(s1) {
			assert.equal(expect, t(s1)({names: [{name:'name1'},{name:'name2'},{name:'name3'}]}));
		});
	});
	it('for in for', function() {
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
	});
	it('if expression is false with else tag', function() {
		var expect = '<div><p>okbyme</p></div>';
		var s = '<div>{{if false}}{{else}}<p>{{=$name}}</p>{{endif}}</div>';
		var data = {name: 'okbyme'};
		assert.equal(expect, t(s)(data));
	});
	it('if expression is false without else tag', function() {
		var expect = '<div></div>';
		var s = '<div>{{if false}}{{=$name}}{{endif}}</div>';
		var data = {name: 'okbyme'};
		assert.equal(expect, t(s)(data));
	});
	it('if expression is true with else tag', function() {
		var expect = '<div></div>';
		var s = '<div>{{if true}}{{else}}{{=$name}}{{endif}}</div>';
		var data = {name: 'okbyme'};
		assert.equal(expect, t(s)(data));
	});
	it('with or without pre compiled template should have the same result', function() {
		var expect = '<div>okbyme</div>';
		var s = '<div>{{=$name}}</div>';
		var data = {name: 'okbyme'};
		assert.equal(expect, t(s)(data));//template compile in runtime
		assert.equal(expect, t(s, true)(data));//precompile template
	});
	it('for scope variable _global in single for loop', function() {
		var expect = '<div>(A)</div><div>(B)</div><div>(C)</div><div>(D)</div>';
		var s = '{{for $qa as $q}}<div>({{=$q._global.listitem[$q._index]}}){{=$q.content}}</div>{{endfor}}'
		var data = {
			listitem: ['A','B','C','D'],
			qa: [
				{content: ''},
				{content: ''},
				{content: ''},
				{content: ''}
			]
		}
		assert.equal(expect, t(s)(data));
	});
	it('for scope variable _global in double for loop', function() {
		var expect = '<div>question1<ol><li><input type="radio" name="q1" value="0" /> (A) </li><li><input type="radio" name="q1" value="1" /> (B) </li><li><input type="radio" name="q1" value="2" /> (C) </li><li><input type="radio" name="q1" value="3" /> (D) </li></ol></div><div>question2<ol><li><input type="radio" name="q2" value="0" /> (A) </li><li><input type="radio" name="q2" value="1" /> (B) </li><li><input type="radio" name="q2" value="2" /> (C) </li><li><input type="radio" name="q2" value="3" /> (D) </li></ol></div><div>question3<ol><li><input type="radio" name="q3" value="0" /> (A) </li><li><input type="radio" name="q3" value="1" /> (B) </li><li><input type="radio" name="q3" value="2" /> (C) </li><li><input type="radio" name="q3" value="3" /> (D) </li></ol></div>';
		var s = '{{for $q as $qs}}<div>{{=$qs.desc}}<ol>{{for $qs.a as $ad}}<li><input type="radio" name="{{=$ad._parent.id}}" value="{{=$ad._index}}" /> ({{=$ad._global.listitem[$ad._index]}}) {{=$ad.desc}}</li>{{endfor}}</ol></div>{{endfor}}';
		var data = {
			listitem: ['A','B','C','D'],
			q: [
				{
					desc: 'question1',
					id: 'q1',
					a: [{desc:''},{desc:''},{desc:''},{desc:''}]
				},
				{
					desc: 'question2',
					id: 'q2',
					a: [{desc:''},{desc:''},{desc:''},{desc:''}]
				},
				{
					desc: 'question3',
					id: 'q3',
					a: [{desc:''},{desc:''},{desc:''},{desc:''}]
				}
			]
		};
		assert.equal(expect, t(s)(data));
	});
	it('for reusing template with different data', function() {
		var expect1 = '<div>name1</div>';
		var expect2 = '<div>name2</div>';
		var s = '<div>{{=$name}}</div>';
		var data1 = {name:'name1'};
		var data2 = {name:'name2'};
		assert.equal(expect1, t(s)(data1));
		assert.equal(expect2, t(s)(data2));
	});
	it('for plain old string array', function() {
		var expect = '<div>name1</div><div>name2</div><div>name3</div>';
		var s = '{{for $a as $i}}<div>{{=$i}}</div>{{endfor}}';
		var data = {a:['name1','name2','name3']};
		assert.equal(expect, t(s)(data));
	});
	it('for plain old number array', function() {
		var expect = '<div>7</div><div>5</div><div>3</div>';
		var s = '{{for $a as $i}}<div>{{=$i}}</div>{{endfor}}';
		var data = {a:[7,5,3]};
		assert.equal(expect, t(s)(data));
	});
	it('for loop without `as` expression', function() {
		var expect = '<div>name0</div><div>name1</div><div>name2</div>';
		var s = '{{for $a}}<div>{{=$_i}}{{=$_i._index}}</div>{{endfor}}';
		var data = {a:['name','name','name']};
		assert.equal(expect, t(s)(data));
	});
	it('for plain old boolean array', function() {
		var expect = '<p>true</p><p>false</p><p>true</p>';
		var s = '{{for $a}}<p>{{=$_i}}</p>{{endfor}}';
		var data = {a:[true,false,true]};
		assert.equal(expect, t(s)(data));
	});
	it('for plain old null array', function() {
		var expect = '<p>null</p><p>null</p><p>null</p>';
		var s = '{{for $a}}<p>{{=$_i}}</p>{{endfor}}';
		var data = {a:[null,null,null]};
		assert.equal(expect, t(s)(data));
	});
	it('for plain old undefined array', function() {
		var expect = '<p>undefined</p><p>undefined</p><p>undefined</p>';
		var s = '{{for $a}}<p>{{=$_i}}</p>{{endfor}}';
		var data = {a:[undefined,undefined,undefined]};
		assert.equal(expect, t(s)(data));
	});
	it('for plain old symbol array', function() {
		var expect = '<p>Symbol(fillano)</p><p>Symbol(fillano)</p><p>Symbol(fillano)</p>';
		var s = '{{for $a}}<p>{{=$_i}}</p>{{endfor}}';
		var data = {a:[Symbol('fillano'),Symbol('fillano'),Symbol('fillano')]};
		assert.equal(expect, t(s)(data));
	});
	it('for complex if within if', function() {
		var expect = '<div><p>okbyme</p></div>';
		var s = '<div>{{if false}}<p>{{if true}}nohere{{endif}}</p>{{else}}<p>{{if true}}{{=$name}}{{endif}}</p>{{endif}}</div>';
		var data = {name:'okbyme'};
		assert.equal(expect, t(s)(data));
	});
	it('for complex for within if', function() {
		var expect = '<div><p>name1</p><p>name2</p><p>name3</p></div>';
		var s1 = '{{if true}}<div>{{for $names}}<p>{{=$_i}}</p>{{endfor}}</div>{{else}}<div>{{for $names}}<p>{{=$_i}}</p>{{endfor}}</div>{{endif}}';
		var s2 = '{{if false}}<div>{{for $names}}<p>{{=$_i}}</p>{{endfor}}</div>{{else}}<div>{{for $names}}<p>{{=$_i}}</p>{{endfor}}</div>{{endif}}';
		var data = {names: ['name1','name2','name3']};
		assert.equal(expect, t(s1)(data));
		assert.equal(expect, t(s2)(data));
	});
    it('for unknown token', function() {
        var expect = '<div>{{unknown(while)}}</div>';
        var s = '<div>{{while $name}}</div>';
        var data = {name:'gar'};
        assert.equal(expect, t(s)(data));
    });
    it('for unknown token in if/else', function() {
        var expect = '<div>{{unknown(while)}}</div>';
        var s1 = '<div>{{if $case===1}}{{while $name}}{{endif}}</div>';
        var s2 = '<div>{{if $case===2}}{{=$name}}{{else}}{{while $name}}{{endif}}</div>';
        var data = {"case":1, "name":"gar"};
        assert.equal(expect, t(s1)(data));
        assert.equal(expect, t(s2)(data));
    });
});

# fit
a simple template engine that just fits my current requirements

# usage
## in javascript
```
var fit = require('./fit') or <script src='fit.min.js'></script>
var template = '<div>{{=$name}}</div>';
var render = fit(template);
console.log(render({name: 'fit'}));
//result: '<div>fit</div>'
```

## template syntax
* left delimiter: {{
* right delimiter: }}
* variable name in template must start with a $
* =
  * {{=$name}}
* for
  * {{for $collect as $item}} content within for {{endfor}}
  * iteration index will be assigned to $item.index
* if
  * {{if expression}} content when the expression is true {{else}} content when the expression is false {{endif}}
  * 
  
## examples
please refer to the test cases in test/test01.js.

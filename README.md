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
* left delimiter: **{{**
* right delimiter: **}}**
* variable name in template must start with a **$**
* =
  * **{{=$name}}** or **{{=$name.prop}}**
* for
  * **{{for $collection as $item}}** content within for **{{endfor}}**
  * in this case, you can access the passed object with **$item** variable
  * iteration index will be assigned to **$item._index**
  * object directly contains the iterated collection will be assigned to **$item._parent**
  * object passed to render() in the above example will be assigned to **$item._global**
  * brief syntax **{{for $collection}}** without 'as' expression, the object passed to each iteration will be named as **$_i**
* if
  * **{{if expression}}** content when the *expression* is true **{{else}}** content when the *expression* is false **{{endif}}**
* for and if can be nested with each others in unlimited levels(but I don't test the case which was deeper than 2 levels, simply because it's not my case.)
  
## examples
please refer to the test cases in test/test01.js.

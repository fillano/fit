[![Build Status](https://travis-ci.org/fillano/fit.svg?branch=master)](https://travis-ci.org/fillano/fit)
[![Coverage Status](https://coveralls.io/repos/github/fillano/fit/badge.svg?branch=master)](https://coveralls.io/github/fillano/fit?branch=master)

# fit
A simple and compact template engine that just fits my current requirements. The file size is only 3kb after minified and there's no runtime dependency.

# usage
## in javascript

In browser,
```
<script src='fit.min.js'></script>
<script>
var template = '<div>{{=$name}}</div>';
var render = fit(template);
console.log(render({name: 'fit'}));
//result: '<div>fit</div>'
</script>
```

In node.js, (not put it to npm repository yet, so please copy 'fit.js' to your project path manually)
```
var fit = require('./fit');
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

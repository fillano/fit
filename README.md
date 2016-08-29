[![Build Status](https://travis-ci.org/fillano/fit.svg?branch=master)](https://travis-ci.org/fillano/fit)
[![Coverage Status](https://coveralls.io/repos/github/fillano/fit/badge.svg?branch=master)](https://coveralls.io/github/fillano/fit?branch=master)

# fit
A simple and compact template engine that just fits my current requirements. The file size is only 3kb after minified and there's no runtime dependency.

# simple usage
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

## options

Options should be passed by the second argument of the **fit(template, options)** function.

Valid options:
1. **options.l_del**: for the string applied as left delimiter in the template. The default value is '{{'.
2. **options.r_del**: for the string applied as right delimiter in the template. The default value is '}}'
3. **options.pre**: specify whether to pre-parse the template while it passed to fit. Specified the value to 'yes' will pre-parse it and 'no' will not. The default value is 'yes'.
4. **options.async**: specify whether to render the result by an async manner. Specified the value to 'yes' and passed an callback function to the render function as the second argument will make it work in an async manner. The default value is 'no'.

for example:
```
var fit = require('./fit');
var template = '<div><{=$name}></div>';
var render = fit(template, {l_del:'<{',r_del:'}>',async:'yes'});
render({name: 'fit'}, function(result) {
    console.log(result);
    //result: '<div>fit</div>'
});
```

## template syntax
* left delimiter: specified by **options.l_del**
* right delimiter: specified by **options.r_del**
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

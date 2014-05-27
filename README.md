# Function#addHooks

A method for the Function prototype that creates 4 hooks for executing actions at various stages of a functions execution.

## Getting Started

```javascript
var myAwesomeFunction = function(){ console.log('Hello Freakin\' World!'); }.addHooks();
```
**OR**

```javascript
var myAwesomeFunction = function(){ console.log('Hello Freakin\' World!'); };

myAwesomeFunction = myAwesomeFunction.addHooks();
```

## Adding A Hooks

There are currently 4 types of hooks implemented:

- before
- after
- modInput
- modOutput

### func#before

```
var myAwesomeFunction = function(){ console.log('Hello Freakin\' World!'); }.addHooks();

myAwesomeFunction.before(function(args){
	
});
```

### func#after

```
var myAwesomeFunction = function(){ console.log('Hello Freakin\' World!'); }.addHooks();

myAwesomeFunction.after(function(args, response){
	
});
```

### func#modInput

```
var myAwesomeFunction = function(){ console.log('Hello Freakin\' World!'); }.addHooks();

myAwesomeFunction.modInput(function(args, response){
	
	return [array];
});
```

### func#modOutput

```
var myAwesomeFunction = function(){ console.log('Hello Freakin\' World!'); }.addHooks();

myAwesomeFunction.modOutput(function(args, response){
	
	return newResponse;
});
```

## Documentation
[Full API Documentation](http://thethechad.github.io/addHooks)

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2014 THEtheChad  
Licensed under the MIT license.
/**
 * @package addHooks
 * @author  THEtheChad
 * @license MIT
 * @version 0.1.0
 * @published 2014-07-18
 * @fileOverview A method for the Function prototype that creates 4 hooks for executing actions at various stages of a functions execution.
 */'use strict';

/**
 * The built in Function object.
 * @external Function
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function Function}
 */

/**
 * This method replaces the normal apply
 * method with a faster version that uses
 * `call` if there are 3 or less arguments
 * @function external:Function#fastApply
 * @param  {object} context - The context in which the function should be run
 * @param  {array|arguments} args - The list of arguments being passed to the function
 * @return {*}
 */
Function.prototype.fastApply = function(context, args){
	args = Array.prototype.slice.call(args);

	/*jshint ignore:start */
	var l = args.length;

	if (l == 0) return this.call(context);
	if (l == 1) return this.call(context, args[0]);
	if (l == 2) return this.call(context, args[0], args[1]);
	if (l == 3) return this.call(context, args[0], args[1], args[2]);
	/*jshint ignore:end */

	return this.apply(context, args);
};

/**
 * This method returns a hookable copy of the
 * original function.
 * @function external:Function#addHooks
 * @return {external:Function#addHooks~hook} Function with hook API
 */
Function.prototype.addHooks = function() {
	// If this is already a function with hooks,
	// return the original function
	if(this.actions){
		return this;
	}

	var self = this;

	/**
	 * A function that wraps the original function and
	 * and includes a hooking api.
	 * @name  external:Function#addHooks~hook
	 * @class
	 * @param {...*}
	 * @return {*} 		 The [modified] response of the original
	 *                 function.
	 */
	function hook() {
		var args, response;

		args = Array.prototype.slice.call(arguments);

		/*jshint validthis:true */
		hook.fire('before', this, args, response);
		/*jshint validthis:true */
		args = hook.fire('modInput', this, args, args);

		// call the actual function
		response = self.fastApply(this, args);

		/*jshint validthis:true */
		response = hook.fire('modOutput', this, response, response);
		/*jshint validthis:true */
		hook.fire('after', this, args, response);

		return response;
	}

	hook.actions = {
		before: [],
		after: [],
		modOutput: [],
		modInput: []
	};

	/**
	 * Add an action to be performed before the
	 * original function is run.
	 * @name external:Function#addHooks~hook.before
	 * @function
	 * @param  {function} action - The action to be performed.
	 */
	hook.before = function(action) {
		hook.actions.before.push(action);
	};

	/**
	 * Add an action to be performed after the
	 * original function is run.
	 * @name external:Function#addHooks~hook.after
	 * @function
	 * @param  {function} action - The action to be performed.
	 */
	hook.after = function(action) {
		hook.actions.after.push(action);
	};

	/**
	 * Used to modify the input arguments before
	 * the original function is run.
	 * @name external:Function#addHooks~hook.modInput
	 * @function
	 * @param  {function} transformer - The function used to modify
	 *                           the arguments.
	 */
	hook.modInput = function(transformer) {
		hook.actions.modInput.push(transformer);
	};

	/**
	 * Used to modify the output of the orginal
	 * function.
	 * @name external:Function#addHooks~hook.modOutput
	 * @function
	 * @param  {function} transformer - The function used to modify
	 *                         the output.
	 */
	hook.modOutput = function(transformer) {
		hook.actions.modOutput.push(transformer);
	};

	/***
	 * Internal method used to execute the queue
	 * of functions for each hook.
	 * @param  {string} type    The name of the hook to execute
	 * @param  {object} context The context in which to execute the functions in the queue
	 * @param  {array} args    The array of arguments used when calling the hook augmented function
	 * @param  {*} data    Any additional data to be passed to the functions in the queue
	 * @return {*}         The reduced return of all functions in the queue
	 */
	hook.fire = function(type, context, args, data) {
		var actions = hook.actions[type];

		for (var i = 0, il = actions.length; i < il; i++) {
			try {
				data = actions[i].call(context, args, data);
			} catch (e) {}
		}

		return data;
	};

	return hook;
};
// 'use strict';

/**
 * The built in Function object.
 * @external Function
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function Function}
 */

/**
 * A function that wraps the original function and
 * and includes a hooking api.
 * @typedef {external:Function#addHooks~hook} hook
 */

/**
 * This method returns a hookable copy of the
 * original function.
 * @function external:Function#addHooks
 * @return {hook} Function with hook API
 */
Function.prototype.addHooks = function() {
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

		hook.fire('before', this, args, response);
		args = hook.fire('modInput', this, args, args);

		// call the actual function
		response = self.apply(this, args);

		response = hook.fire('modOutput', this, response, response);
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
			try{
				data = actions[i].call(context, args, data);
			}catch(e){}
		}

		return data;
	};

	return hook;
};
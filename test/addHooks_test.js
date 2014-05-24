'use strict';

require('../lib/addHooks.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

var func, hook;

exports['Function#addHooks'] = {
  setUp: function(done) {

    func = function() {
      var args = Array.prototype.slice.call(arguments);
      var value = this.value;

      for (var i = 0, il = args.length; i < il; i++) {
        value += args[i];
      }

      return value;
    };
    hook = func.addHooks();

    done();
  },
  'should provide an api': function(test) {
    test.expect(4);
    test.ok(hook.before, 'before method');
    test.ok(hook.after, 'after method');
    test.ok(hook.modInput, 'modInput method');
    test.ok(hook.modOutput, 'modOutput method');
    test.done();
  },
  'should be transparent to original function': function(test) {
    test.expect(2);

    var ctx = {
      value: 'a'
    };
    var args = ['b', 'c', 'd'];

    test.equal(hook.call(ctx), func.call(ctx), 'The function should be called with the proper context.');
    test.equal(func.apply(ctx, args), hook.apply(ctx, args), 'The function should be called with the proper arguments.');
    test.done();
  },
  'before': function(test) {
    test.expect(2);

    var ctx = {
      value: 1
    };
    var args = [2, 3, 4, 5];

    hook.before(function(args) {
      test.equal(this, ctx, 'The hook should be called with the proper context.');
      test.equal(args, args, 'The hook should be called with the proper arguments.');
    });

    hook.apply(ctx, args);

    test.done();
  },
  'after': function(test) {
    test.expect(3);

    var ctx = {
      value: 1
    };
    var args = [2, 3, 4, 5];
    var ret = func.apply(ctx, args);

    hook.after(function(args, result) {
      test.equal(this, ctx, 'The hook should be called with the proper context.');
      test.equal(args, args, 'The hook should be called with the proper arguments.');
      test.equal(result, ret, 'The hook should be called with the proper result.');
    });

    hook.apply(ctx, args);

    test.done();
  },
  'modOutput': function(test) {
    test.expect(3);

    var ctx = {
      value: 1
    };
    var args = [2, 3, 4, 5];
    var ret = func.apply(ctx, args);
    var value = 7777;

    hook.modOutput(function(output) {
      test.equal(this, ctx, 'The hook should be called with the proper context.');
      test.equal(output, ret, 'The hook should be called with the proper result.');

      return value;
    });

    var result = hook.apply(ctx, args);

    test.equal(result, value, 'The final output should match the value returned by the hook.');

    test.done();
  },
  'modInput': function(test) {
    test.expect(3);

    var ctx = {
      value: 1
    };
    var args = [2, 3, 4, 5];

    var sub = [6, 7, 8, 9];
    var ret = func.apply(ctx, sub);

    hook.modInput(function(args) {
      test.equal(this, ctx, 'The hook should be called with the proper context.');
      test.equal(args, args, 'The hook should be called with the proper arguments.');

      return sub;
    });

    var result = hook.apply(ctx, args);

    test.equal(result, ret, 'The final output should reflect the altered input.');

    test.done();
  },
  'should catch errors in hooks': function(test) {
    test.expect(2);

    var ctx = {
      value: 1
    };
    var args = [2, 3, 4, 5];
    var ret = func.apply(ctx, args);
    var result;

    function throwErr(){
      throw new Error();
    }

    hook.before(throwErr);
    hook.after(throwErr);
    hook.modInput(throwErr);
    hook.modOutput(throwErr);

    test.doesNotThrow(function() {
      result = hook.apply(ctx, args);
    });

    test.equal(result, ret);

    test.done();
  }

  // TODO: ADD PROPER ERROR HANDLING
};
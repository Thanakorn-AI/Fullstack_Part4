// tests/list_helper.test.js
const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');

test('dummy returns one', () => {
  const blogs = [];  // Even though the dummy function doesn't use the input, we pass an empty array to fit the expected function signature.
  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);  // This test checks if the dummy function always returns 1.
});

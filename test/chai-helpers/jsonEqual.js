function jsonify(x) {
  try {
    return JSON.stringify(JSON.parse(x));
  } catch (e) {
    return undefined;
  }
}

module.exports = function (chai, utils) {
  chai.Assertion.addChainableMethod('jsonEqual',
    function (x) {
      const expected = jsonify(x);
      const actual = jsonify(this._obj);

      this.assert(
        utils.eql(actual, expected),
        'expected #{act} to have the same JSON representation as #{exp}',
        'expected #{act} to have a different JSON representation than #{exp}',
        expected,
        actual
      );
    });
};

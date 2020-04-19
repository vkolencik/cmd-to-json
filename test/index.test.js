const rewire = require('rewire');
const {describe, it} = require('mocha');
const {expect} = require('chai');
const index = rewire('../src/index.js');

describe('getPropertyInfo()',() => {
  const getPropertyInfo = index.__get__('getPropertyInfo');

  [
    {propertyInfo: 'a', name: 'a', format: null},
    {propertyInfo: 'a:number', name: 'a', format: 'number'},
  ].forEach(({propertyInfo, name, format}) =>
    it(`should extract property info from string "${propertyInfo}"`, () => {
      expect(getPropertyInfo(propertyInfo)).to.deep.equal({name: name, format: format});
    }));

  [
    'a:string:xyz'
  ].forEach(propertyInfo => it(`should throw an error for property info string ${propertyInfo}`, () => {
    expect(() => getPropertyInfo(propertyInfo)).to.throw();
  }));
});

describe('formatValue()',() => {
  const formatValue = index.__get__('formatValue');

  [
    {value: 'a', formattedValue: 'a' },
    {value: '1', formattedValue: 1 },
    {value: '1.4', formattedValue: 1.4 },
    {value: '-1', formattedValue: -1 },
    {value: '1', format: 'string', formattedValue: '1' },
    {value: '1.1', format: 'string', formattedValue: '1.1' },
    {value: 'true', format: 'string', formattedValue: 'true' },
    {value: 'false', format: 'string', formattedValue: 'false' },
    {value: 'true', formattedValue: true },
    {value: 'false', formattedValue: false },
    {value: 'a\nb', formattedValue: 'a\nb' },
    {value: 'a\nb\r\nc\n\n\nd', format: 'singleline', formattedValue: 'a b c d' },
  ].forEach(({value, format, formattedValue}) =>
    it(`should format value ${value} as ${formattedValue} with format ${format}`, () => {
      expect(formatValue(value, format)).to.equal(formattedValue);
    }));

  [
    {value: '1', format: 'asdf'},
    {value: 'true', format: 'asdf'},
    {value: 'x', format: 'number'},
    {value: 'x', format: 'boolean'},
    {value: '1,1', format: 'number'},
  ].forEach(({value, format}) => it(`should reject value ${value} with format ${format}`, () => {
    expect(() => formatValue(value, format)).to.throw();
  }));
});

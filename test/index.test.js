const rewire = require('rewire');
const {describe, it} = require('mocha');
const {expect} = require('chai');
const index = rewire('../src/index.js');

describe('getPropertyInfo()',() => {
  const getPropertyInfo = index.__get__('getPropertyInfo');

  [
    {propertyInfo: '--a', name: 'a', format: null},
    {propertyInfo: '--a:number', name: 'a', format: 'number'},
  ].forEach(({propertyInfo, name, format}) =>
    it(`should extract property info from string "${propertyInfo}"`, () => {
      expect(getPropertyInfo(propertyInfo)).to.deep.equal({name: name, format: format});
    }));

  [
    'a',
    'a:string',
    '--a:string:xyz'
  ].forEach(propertyInfo => it(`should throw an error for property info string ${propertyInfo}`, () => {
    expect(() => getPropertyInfo(propertyInfo)).to.throw();
  }));
});

describe('formatValue()',() => {
  const formatValue = index.__get__('formatValue');

  [
    {value: 'a', formattedValue: 'a', format: null },
    {value: '1', formattedValue: 1, format: null },
    {value: '1.4', formattedValue: 1.4, format: null },
    {value: '-1', formattedValue: -1, format: null },
    {value: '1', formattedValue: '1', format: 'string' },
  ].forEach(({value, format, formattedValue}) =>
    it(`should format value ${value}`, () => {
      expect(formatValue(value, format)).to.equal(formattedValue);
    }));
});

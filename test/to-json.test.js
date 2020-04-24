const rewire = require('rewire');
const {describe, it} = require('mocha');
const {expect} = require('chai');
const index = rewire('../src/create-json.js');

describe('getPropertyInfo()',() => {
  const getPropertyInfo = index.__get__('getPropertyInfo');

  [
    {propertyInfo: 'a', expectedPath: ['a'], format: null},
    {propertyInfo: 'a:number', expectedPath: ['a'], format: 'number'},
    {propertyInfo: 'a_b', expectedPath: ['a_b'], format: null},
    {propertyInfo: 'a-b', expectedPath: ['a-b'], format: null},
    {propertyInfo: 'a.b.c', expectedPath: ['a','b','c'], format: null},
  ].forEach(({propertyInfo, expectedPath, format}) =>
    it(`should extract property info from string "${propertyInfo}"`, () => {
      expect(getPropertyInfo(propertyInfo)).to.deep.equal({path: expectedPath, format: format});
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
    {value: '', formattedValue: '' },
    {value: '"', formattedValue: '"' },
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
    {value: '', format: 'number'},
    {value: '', format: 'boolean'}
  ].forEach(({value, format}) => it(`should reject value "${value}" with format ${format}`, (done) => {
    expect(() => formatValue(value, format)).to.throw();
    done();
  }));
});

describe('setValueToObject()', () => {
  const setValueToObject = index.__get__('setValueToObject');

  [
    {path: ['a', 'b', 'c'], value: 'x', object: {}, expectedResult: {a: {b: {c: 'x'}}}},
    {path: ['a', 'b', 'c'], value: 'x', object: {a: {b: {c: 'a'}}}, expectedResult: {a: {b: {c: 'x'}}}},
  ].forEach(({path, value, object, expectedResult}) => it(`should set value to path ${path}`, () => {
    setValueToObject(path, value, object);
    expect(object).to.deep.equal(expectedResult);
  }));

  [
    {path: ['a', 'b', 'c'], value: 'x', object: {a: {b: 'x'}}},
    {path: ['a', 'b', 'c'], value: 'x', object: {a: {b: {c: {d: 'a'}}}}}
  ].forEach(({path, value, object}) => it(`should throw for invalid path ${path}`, () => {
    expect(() => setValueToObject(path, value, object)).to.throw();
  }));
});

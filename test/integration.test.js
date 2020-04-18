const {exec} = require('child_process');
const {describe, it} = require('mocha');
const chai = require('chai');
chai.use(require('./chai-helpers/jsonEqual'));
const expect = chai.expect;

function runCmd(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }

      let result = {};
      if (stderr) {
        result.stderr = stderr;
      }
      result.output = stdout;
      resolve(result);
    });
  });
}

describe('to-json command', () => {
  it('should return empty json when called without arguments', async () => {
    const {output} = await runCmd('to-json');
    expect(output).to.equal('{}');
  });

  [
    {
      description: 'single parameter',
      args: '--a=b',
      expectedOutput: {a: 'b'}
    },
    {
      description: 'multi-word value',
      args: '--a="more than one word"',
      expectedOutput: {a: 'more than one word'}
    },
    {
      description: 'two parameters',
      args: '--a=b --c=d',
      expectedOutput: {a: 'b', c: 'd'}
    },
    {
      description: 'number values',
      args: '--a=1 --b=1.2345 --c=12e4 --d=-5 --e:string=27',
      expectedOutput: {a: 1, b: 1.2345, c: 120000, d: -5, e: '27'}
    },
    {
      description: 'array',
      args: '--a=x --a=y --a=z',
      expectedOutput: {a: ['x', 'y', 'z']}
    }
  ].forEach(({args, expectedOutput, description}) =>
    it(`should return json representation of parameters - ${description}`, async () => {
      const {output} = await runCmd(`to-json ${args}`);
      expect(output).to.jsonEqual(JSON.stringify(expectedOutput));
    }));
});

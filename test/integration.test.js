const {exec} = require('child_process');
const {describe, it } = require('mocha');
const { expect } = require('chai');

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
  it('should return empty json when called without parameters', (done) => {
    runCmd('to-json')
      .then(({output}) => {
        expect(output).to.equal('{}');
        done();
      });
  });
});

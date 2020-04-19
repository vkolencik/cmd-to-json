const {exec} = require('child_process');
const {describe, it} = require('mocha');
const chai = require('chai');
chai.use(require('./chai-helpers/jsonEqual'));
const expect = chai.expect;

function runCmd(cmd, env = {}) {
  return new Promise((resolve, reject) => {
    exec(cmd, {env: {...env, ...process.env}}, (error, stdout, stderr) => {
      let result = {
        output: stdout,
        errorOutput: stderr
      };

      if (error) {
        result.error = error;
        reject(result);
      } else {
        resolve(result);
      }
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
      args: 'a=b',
      expectedOutput: {a: 'b'}
    },
    {
      description: 'multi-word value',
      args: 'a="more than one word"',
      expectedOutput: {a: 'more than one word'}
    },
    {
      description: 'back-slash',
      args: 'a="x\\y"',
      expectedOutput: {a: 'x\\y'}
    },
    {
      description: 'two parameters',
      args: 'a=b c=d',
      expectedOutput: {a: 'b', c: 'd'}
    },
    {
      description: 'formatted values',
      args: 'age=31 height=1.7345 income=12e4 temperature=-5 streetNumber:string=27 married=true word:string=true',
      expectedOutput: {
        age: 31,
        height: 1.7345,
        income: 120000,
        temperature: -5,
        streetNumber: '27',
        married: true,
        word: 'true'
      }
    },
    {
      description: 'different property naming conventions',
      args: 'first_name="Snake" middle-name="Kebab" lastName="Camel"',
      expectedOutput: {'first_name': 'Snake', 'middle-name': 'Kebab', 'lastName': 'Camel'}
    },
    {
      description: 'deep members',
      args: 'date="2020-01-01" person.name="John" person.age=32 comment.text="hello world"',
      expectedOutput: {
        date: '2020-01-01',
        person: {
          name: 'John',
          age: 32
        },
        comment: {text: 'hello world'}
      }
    }
  ].forEach(({args, expectedOutput, description}) =>
    it(`should return json representation of parameters - ${description}`, async () => {
      const {output} = await runCmd(`to-json ${args}`);
      expect(output).to.jsonEqual(JSON.stringify(expectedOutput));
    }));

  [
    'a:asdf=xyz',
    'a:bool=xyz',
    'a:number=a1',
    'a.b=1 a.b.c=2'
  ].forEach(invalidInput => it(`should reject ${invalidInput} because of invalid format`, (done) => {
    runCmd(`to-json ${invalidInput}`).catch(({errorOutput}) => {
      expect(errorOutput).to.not.be.empty;
      done();
    });
  }));

  if (process.platform !== 'win32') {
    // this test uses env var containing newline string and doesn't work on windows

    [
      {envVarValue: 'a\nb\r\n\r\nc', format: 'singleline', expectedOutputJson: '{"a": "a b c"}'},
      {envVarValue: 'a\nb\r\n\r\nc', format: 'string', expectedOutputJson: '{"a": "a\\nb\\r\\n\\r\\nc"}'},
    ].forEach(({envVarValue, format, expectedOutputJson}) => {
      it('should format multiline string correctly', async () => {
        const {output} = await runCmd(`to-json a:${format}="$x"`, {x: envVarValue});
        expect(output).to.jsonEqual(expectedOutputJson);
      });
    });
  }
});

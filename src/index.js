function createJson(args) {
  let result = processArguments(args.slice(2));
  process.stdout.write(JSON.stringify(result));
}

function processArguments(args) {
  const result = {};

  for (const arg of args) {
    const [name, value] = arg.split('=');
    result[name.slice(2)] = value;
  }

  return result;
}

module.exports = createJson;

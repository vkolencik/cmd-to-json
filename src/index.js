function createJson(args) {
  let result = processArguments(args.slice(2));
  process.stdout.write(JSON.stringify(result));
}

function processArguments(args) {
  const result = {};

  for (const arg of args) {
    const [propertyInfo, value] = arg.split('=');
    const {name} = getPropertyInfo(propertyInfo);
    const formattedValue = formatValue(value);

    if (!result[name]) {
      result[name] = formatValue(value);
    } else if (Array.isArray(result[name])) {
      result[name].push(formattedValue);
    } else {
      result[name] = [result[name], formattedValue];
    }
  }

  return result;
}

function getPropertyInfo(name) {
  const components = name.match(/^--([^:]+):?(.*)$/);
  if (!components) {
    throw new Error('Property parameters must begin with double dash, like this: "--name=John"');
  }

  return {
    name: components[1],
    type: components[2]
  };
}

function formatValue(value) {
  return Number(value) || value;
}

module.exports = createJson;

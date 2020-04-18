function createJson(args) {
  let result = processArguments(args.slice(2));
  process.stdout.write(JSON.stringify(result));
}

function processArguments(args) {
  const result = {};

  for (const arg of args) {
    const [propertyInfo, value] = arg.split('=');
    const {name, format} = getPropertyInfo(propertyInfo);
    const formattedValue = formatValue(value, format);

    if (!result[name]) {
      result[name] = formattedValue;
    } else if (Array.isArray(result[name])) {
      result[name].push(formattedValue);
    } else {
      result[name] = [result[name], formattedValue];
    }
  }

  return result;
}

function getPropertyInfo(name) {
  const components = name.match(/^--([^:]+):?(\w*)$/);
  if (!components) {
    throw new Error('Property parameters must begin with double dash, like this: "--name=John"');
  }

  return {
    name: components[1],
    format: components[2] || null
  };
}

function formatValue(value, format) {
  if (format && !formatters[format]) {
    throw new Error(`Unknown format "${format}"`);
  }
  return formatters[format || 'default'](value);
}

const formatters = {
  default: x => Number(x) || x,
  string: x => x,
  singleline: x => x.replace(/[\r\n.]+/g, ' ')
};

module.exports = createJson;

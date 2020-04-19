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
  const components = name.match(/^([^:]+):?(\w*)$/);
  if (!components) {
    throw new Error('Parameters must be in the form name="John"');
  }

  return {
    name: components[1],
    format: components[2] || null
  };
}

function formatValue(value, format) {
  let formatter = formatters.find(f => f.name === (format || 'default'));
  if (!formatter) {
    throw new Error(`Unknown format "${format}"`);
  }

  return formatter.format(value);
}

const formatters = [
  { name: 'default', format: x => Number(x) || x },
  { name: 'string', format: x => x, },
  { name: 'singleline', format: x => x.replace(/[\r\n.]+/g, ' ') }
];

module.exports = createJson;

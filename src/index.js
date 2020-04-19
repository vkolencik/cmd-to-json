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
  let formatter = formatters.find(f => f.name === (format));

  if (format) {
    if (!formatter) {
      throw new Error(`Unknown format "${format}"`);
    } else if (!formatter.supports(value)) {
      throw new Error(`Value "${value} cannot be formatted as ${format}`);
    }
  }

  if (!formatter) {
    formatter =  formatters.find(f => f.supports(value));
  }

  return formatter.format(value);
}

const formatters = [
  { name: 'boolean', supports: x => ['true', 'false'].includes(x.toLowerCase()), format: x => x === 'true' },
  { name: 'number', supports: x => !isNaN(x), format: x => Number(x) },
  { name: 'string', supports: () => true, format: x => x }, // fallback format

  // special formatters that need to be explicitly specified;
  { name: 'singleline', supports: () => true, format: x => x.replace(/[\r\n.]+/g, ' ') }
];

module.exports = createJson;

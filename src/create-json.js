function createJson(args) {
  let result = processArguments(args);
  return JSON.stringify(result);
}

module.exports = createJson;

function processArguments(args) {
  const result = {};

  for (const arg of args) {
    const [propertyInfo, value] = arg.split('=');
    const {path, format} = getPropertyInfo(propertyInfo);
    const formattedValue = formatValue(value, format);

    setValueToObject(path, formattedValue, result);
  }

  return result;
}

function setValueToObject(path, value, object) {
  let context = object;
  for (let propertyName of path.slice(0, path.length -1)) {
    if (context[propertyName] === undefined) {
      context[propertyName] = {};
    } else if (typeof context[propertyName] !== 'object') {
      throw Error(`Invalid path ${path.join('→')}, there's already a value in the way (${context[propertyName]})`);
    }
    context = context[propertyName];
  }

  if (context[path[path.length - 1]] && typeof context[path[path.length - 1]] === 'object') {
    throw Error(`Invalid path ${path.join('→')}, there's already a deeper structure in the way`);
  }
  context[path[path.length - 1]] = value;
}

function getPropertyInfo(name) {
  const components = name.match(/^([^:]+):?(\w*)$/);
  if (!components) {
    throw new Error('Parameters must be in the form name="John" (or name:string="John")');
  }

  return {
    path: components[1].split('.'),
    format: components[2] || null
  };
}

function formatValue(value, format) {
  const formatters = [
    { name: 'boolean', supports: x => x && ['true', 'false'].includes(x.toLowerCase()), format: x => x === 'true' },
    { name: 'number', supports: x => !isNaN(x), format: x => Number(x) },
    { name: 'string', supports: () => true, format: x => x }, // fallback format

    // special formatters that need to be explicitly specified;
    { name: 'singleline', supports: () => true, format: x => x.replace(/[\r\n.]+/g, ' ') }
  ];

  let formatter = formatters.find(f => f.name === (format));

  if (format) {
    if (!formatter) {
      throw new Error(`Unknown format "${format}"`);
    } else if (!formatter.supports(value)) {
      throw new Error(`Value "${value} cannot be formatted as ${format}`);
    }
  }

  // no explicit format specified → find the first one that fits:
  if (!formatter) {
    formatter =  formatters.find(f => f.supports(value));
  }

  return formatter.format(value);
}

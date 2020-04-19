#!/usr/bin/env node
try {
  process.stdout.write(require('../src/create-json')(process.argv.slice(2)));
} catch (e) {
  console.error(e.message);
  process.exit(1);
}

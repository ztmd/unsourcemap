'use strict';

const fs = require('fs');
const path = require('path');

function parse(content) {
  try {
    // prevent XSSI
    return JSON.parse(content.replace(/^\)\]\}'[^\n]*\n/, ''));
  } catch (e) {
    process.stdout.write(e.toString() + '\n');
    process.exit(0);
  }
  return false;
}

// unique
const values = {};

function sanitize(input = '', replacement = '_') {
  let ret = (input + '')
    .replace(/^\.+$|[.\s]+$/, replacement)
    .replace(/[?<>:*|":\x00-\x1f\x80-\x9f]/g, replacement)
    .replace(/^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i, replacement)
    .replace(/(\/|\\){1,}/g, '/');

  if (values[ret]) {
    values[ret]++;
    return `${ret}_${values[ret]}`;
  }
  values[ret] = 1;
  return ret;
}

function unsourcemap(raw, options) {
  const sourcemap = parse(raw);

  const {
    mode,
    output,
    async,
    verbose,
    force,
    replacement,
    dot
  } = Object.assign(unsourcemap.defaults, options || {});

  const result = {};
  result.version = sourcemap.version;
  result.names = sourcemap.names;
  result.sources = sourcemap.sources;
  result.mappings = sourcemap.mappings;
  result.file = sourcemap.file;
  result.len = sourcemap.sources.length;
  result.sourceRoot = sourcemap.sourceRoot;

  if (!fs.existsSync(output)) {
    fs.mkdirSync(output, {recursive: true});
  }

  sourcemap.sources.forEach((item, index) => {
    if (mode === 'webpack') {
      item = item.replace('webpack://', '');
      if (dot) {
        item = item.replace(/^\/\./, replacement);
      }
    }

    item = sanitize(item, replacement);

    let match = item.match(/^(.+)\/([^/]+)$/) || [];

    let [filepath, filename] = [match[1] || '', match[2] || item];

    filepath = path.join(output, sourcemap.sourceRoot || '', filepath);

    if (!fs.existsSync(filepath)) {
      fs.mkdirSync(filepath, {recursive: true});
    }

    filepath = path.join(filepath, filename);
    if (fs.existsSync(filepath) && !force) {
      process.stdout.write(`${filepath} is already existed, use '--force' flag to overwrite it anyway.\n`);
    } else if (async) {
      fs.writeFile(filepath, sourcemap.sourcesContent[index], err => {
        if (err) throw err;
        if (verbose) {
          process.stdout.write(`${filepath} saved successful.\n`);
        }
      });
    } else {
      fs.writeFileSync(filepath, sourcemap.sourcesContent[index]);
      if (verbose) {
        process.stdout.write(`${filepath} saved successful.\n`);
      }
    }
  });

  return result;

}

unsourcemap.defaults = {
  mode: 'webpack',
  output: 'dist',
  replacement: '_',
  async: false,
  verbose: false,
  force: false,
  dot: true
};

module.exports = unsourcemap;

# unsourcemap

Unpack JavaScript sourcemap.

## Install

npm:

```shell
npm install unsourcemap --global
```

yarn:

```shell
yarn global add unsourcemap
```

## Usage

```shell
unsourcemap input [options]
```

See [help](docs/help) for more information.

`input` is a required parameter, it can also be a directory.

If `input` is a directory, `unsourcemap` will traverse all the files in this directory and deal each file. Use `--no-check` to ignore checking the filename is end with `.map`.

## Examples

```shell
unsourcemap bundle.js.map
unsourcemap bundle.js.map --output app
unsourcemap --input=bundle.js.map --force
unsourcemap -i=bundle.js.map --verbose --no-dot
```

## Available Options

### `--version`/`-v`

Display the verison.

### `--help`/`-h`

Display the help document.

### `--mode`

- type: String
- default: 'webpack'

Internal usage, support `webpack` only.

> Remove `webpack://` from the `sourcemap.source`.

### `--dot`

- type: Boolean
- default: **true**

In `webpack` mode, replace the prefix dot `/.`.

> `path.join` will ignore `/./`.

### `--input`/`-i`

- type: String

Specify the input filepath.

### `--output`/`-o`

- type: String
- default: 'dist'

Directory for file output.

### `--replacement`

- type: String
- default: '_'

Replacement for sanitize filepath.

- windows reserved names like `con|prn|aux|nul|com`.
- any illegal character in `?<>:\*\|":`.
- control character.
- only dot(s).
- trailing dot or space.

### `--async`

- type: Boolean
- default: false

Use `writeFile` instead of `writeFileSync` for speed.

### `--verbose`

- type: Boolean
- default: false

Print the filepath which is written successful.

### `--force`

- type: Boolean
- default: false

Force writeFile even if the file is already existed.

### `--check`

- type: Boolean
- default: **true**

Check filename is end with `.map`.

### `-d`/`--depth`

Max depth about directory to extract.

## Development

Checkout this repository locally, then:

```shell
node bin/unsourcemap
```

## References

- [Source Map Revision 3 Proposal](https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k)
- [Introduction to JavaScript Source Maps](https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/)
- [mozilla/source-map](https://github.com/mozilla/source-map)
- [Variable-length quantity](https://en.wikipedia.org/wiki/Variable-length_quantity)

## Changelog

### v0.0.3

> 2019-05-20

- drop support for `--strict` and `-c`, use `--check` exactly.
- remove .vscode
- support directory recrusive

### v0.0.2

> 2019-04-11

- support directory

### v0.0.1

> 2019-04-11

- first publish

## License

MIT

> See [LICENSE](LICENSE) for more information.

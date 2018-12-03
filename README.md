# ArgParser
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/SlimIO/is/commit-activity)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)
![V1.0](https://img.shields.io/badge/version-0.1.0-blue.svg)

NodeJS light Argv parser.

> This project has been designed for an internal usage.

## Why

- Focus on security
- Only ship feature required for SlimIO.

## Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com).

```bash
$ npm i @slimio/arg-parser
# or
$ yarn add @slimio/arg-parser
```

## Usage example

```js
const { strictEqual } = require("assert");
const ArgParser = require("@slimio/arg-parser");

const argv = new ArgParser("v1.0.0")
    .addCommand("-c --colors [array]", "Array of colors")
    .addCommand("--verbose", "Enable verbose mode!");

const colors = ["red", "yellow"];
const result = argv.parse(["-c" , ...colors, "--verbose"]);
strictEqual(result.get("verbose"), true);
strictEqual(result.get("colors").toString(), colors.toString());
```

## API

### constructor(version: string, description?: string)
Create a new ArgParser instance.

- description describe the CLI itself and is intended to be used in **showHelp()**.

```js
new ArgParser("V1.0.0", "A super CLI!!");
```

### addCommand(cmd: string, description?: string): ArgParser
Add a new command. cmd is a string pattern that will be matched against the following regex:
```js
/^(-{1}(?<shortcut>[a-z]){1})?\s?(-{2}(?<name>[a-z]+)){1}\s?(\[(?<type>number|string|array)(=(?<defaultVal>.*))?\])?$/;
```

### showHelp()
Stdout help instructions on how to use the CLI.

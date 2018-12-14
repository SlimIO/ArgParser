# ArgParser
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/SlimIO/is/commit-activity)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)
![V1.0](https://img.shields.io/badge/version-0.1.0-blue.svg)
![0DEP](https://img.shields.io/badge/Dependencies-0-yellow.svg)

Fast, Secure and light Command Line Argument parser for Node.js ! ArgParser was designed to be embedded in a SlimIO agent, most popular library was not matching our expectation of a light and secure Arg parser.

It does not aim to replace popular CLI lib like `yargs` or `commander`. Please, do not use this package if you do not know what you are doing.

## Why

- Secure with 0 external dependencies.
- Only ship feature required for SlimIO.
- Light and fast !

## Features

- Support number, string, boolean and array types.
- Synchronous API.

## Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com).

```bash
$ npm i @slimio/arg-parser
# or
$ yarn add @slimio/arg-parser
```

## Usage example

Create the following javascript script:
```js
const { parseArg, argDefinition } = require("@slimio/arg-parser");

const result = parseArg([
    argDefinition("-c --colors [array]", "Array of colors"),
    argDefinition("--verbose", "Enable verbose mode!")
]);

console.log(result);
```

And then run the following command line:
```bash
$ node yourscript --colors red blue --verbose
```

For help run:
```bash
$ node yourscript --help
```

## API

### argDefinition(cmd: string, description?: string): Command
Generate a new Command definition. cmd argument is a string pattern that will be matched against the following regex:
```js
/^(-{1}(?<shortcut>[a-z]){1})?\s?(-{2}(?<name>[a-z]+)){1}\s?(\[(?<type>number|string|array)(=(?<defaultVal>.*))?\])?$/;
```

Take a look at the root directory `example` for more examples of how to use addCommand !
```js
const { parseArg, argDefinition } = require("@slimio/arg-parser");

const result = parseArg([
    argDefinition("--verbose", "Enable verbose mode!"),
    argDefinition("-a --autoreload [number=500]", "Configuration Autoreload delay in number")
]);
```

A command is described as follow on TypeScript:
```ts
interface Command {
    name: string;
    type: string;
    description: string;
    shortcut?: string;
    defaultVal?: number | string | boolean | any[];
}
```
Feel free to redefine the wrapper as you want !

### parseArg(argDefinitions: Command[], argv?: string[]): Map< string, any >
Parse Argv (or any input array).

const { parseArg, argDefinition } = require("../");

/**
 * @typedef {Object} Argv
 * @property {Boolean} verbose
 * @property {Number} autoreload
 */

/** @type {!ArgParser.ArgvResult<Argv>} */
const result = parseArg([
    argDefinition("--verbose", "Enable verbose mode!"),
    argDefinition("-a --autoreload [number=500]", "Configuration Autoreload delay in number")
]);

console.log(result);

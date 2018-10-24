// Require Node.js Dependenties
// Require third-party Dependenties
// const avaTest = require("ava");

// Require internal Dependenties
const ArgParser = require("../src/argParser.class");

const argPars = new ArgParser();
argPars.addCommand("h", "help", "print help");
argPars.addCommand("v", "version", "Give acrtual version of the module");
argPars.addCommand("t", "test", "Speciale test");
console.log( argPars.parse() );


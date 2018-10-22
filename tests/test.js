// Require Node.js Dependenties
// Require third-party Dependenties
// const avaTest = require("ava");

// Require internal Dependenties
const ArgParser = require("../src/argParser.class");

const argPars = new ArgParser();
argPars.addOption("h", "help", "print help");
argPars.addOption("v", "version", "Give acrtual version of the module");
argPars.addOption("t", "test", "Speciale test");
argPars.parse();

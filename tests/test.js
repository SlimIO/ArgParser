// Require Node.js Dependenties
// Require third-party Dependenties
// const avaTest = require("ava");

// Require internal Dependenties
const ArgParser = require("../src/argParser.class");
const special = {
    description: "Speciale test String",
    defaultVal: "SpecialVal",
    shortcut: "s"
};
const hello = {
    description: "Speciale test Number",
    shortcut: "h"
};
const silent = {
    description: "Speciale test boolean",
    defaultVal: true,
    shortcut: "i"
};
const buzz = {
    description: "fizz buzz",
    defaultVal: true,
    shortcut: "f"
};
// const dupli = {
//     description: "duplicate",
//     shortcut: "b"
// }

const argPars = new ArgParser("0.1.0");
argPars.addCommand("special", special);
argPars.addCommand("hello", hello);
argPars.addCommand("silent", silent);
argPars.addCommand("fizz", buzz);

// console.log(argPars.shortcuts);
argPars.parse();
// console.log(argPars.parsedArg);

// console.log(argPars.commands);

// Shortcuts exemples
// argPars.addCommand("h", "help", "print help");
// argPars.addCommand("v", "version", "Give acrtual version of the module");
// argPars.addCommand("t", "test", "Speciale test");

// argPars.help();

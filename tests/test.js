// Require Node.js Dependenties
// Require third-party Dependenties
// const avaTest = require("ava");

// Require internal Dependenties
const ArgParser = require("../src/argParser.class");
const special = {
    description: "Speciale test String",
    defaultVal: "SpecialVal",
    shortcut: "S"
};
const hello = {
    description: "Say hello",
    defaultVal: "hello World",
    shortcut: "he"
};
const silent = {
    description: "Speciale test boolean",
    defaultVal: true,
    shortcut: "s"
};
const buzz = {
    description: "fizz buzz",
    defaultVal: true,
    shortcut: "f"
};
const dupli = {
    description: "duplicate",
    shortcut: "b"

};

const argPars = new ArgParser("0.1.0");
argPars.addCommand("special", special);
argPars.addCommand("hello", hello);
argPars.addCommand("silent", silent);
argPars.addCommand("fizz", buzz);

// console.log(argPars.shortcuts);
argPars.parse();
console.log(argPars.parsedArg);
// console.log(argPars.commands);


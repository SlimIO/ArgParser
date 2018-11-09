// Require Node.js Dependenties
// Require third-party Dependenties
// const avaTest = require("ava");

// Require internal Dependenties
const ArgParser = require("../src/argParser.class");
const number = {
    description: "Speciale test String",
    defaultVal: 25,
    shortcut: "n"
};
const hello = {
    description: "Say hello",
    defaultVal: "hello World",
    shortcut: "he"
};
const silent = {
    description: "Speciale test boolean",
    defaultVal: "Salut",
    shortcut: "s",
    type: "boolean"
};
const buzz = {
    description: "fizz buzz",
    defaultVal: true,
    shortcut: "f"
};

const argPars = new ArgParser("0.1.0");
argPars.addCommand("number", number);
argPars.addCommand("hello", hello);
argPars.addCommand("silent", silent);
argPars.addCommand("fizz", buzz);

// console.log(argPars.shortcuts);
const result = argPars.parse();
console.log(result);
// console.log(argPars.parsedArg);
// console.log(argPars.commands);


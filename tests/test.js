// Require Node.js Dependenties
// Require third-party Dependenties
// const avaTest = require("ava");

// Require internal Dependenties
const ArgParser = require("../src/argParser.class");
const version = {
    description: "Speciale test String",
    defaultVal: "SpecialVal",
    shortcut: "s"
};
const optTest2 = {
    description: "Speciale test Number",
    defaultVal: 10,
    shortcut: "n"
};
const optTest3 = {
    description: "Speciale test boolean",
    defaultVal: true,
    shortcut: "b"
};

const argPars = new ArgParser("0.1.0");
argPars.addCommand("version", version);
argPars.addCommand("hello", optTest2);
argPars.addCommand("silent", optTest3);
// argPars.addCommand("h", "help", "print help");
// argPars.addCommand("v", "version", "Give acrtual version of the module");
// argPars.addCommand("t", "test", "Speciale test");
const parsedArg = argPars.parse();
console.log(parsedArg);

// console.log(argPars.parse());

// argPars.help();
// argPars.getVersion();

argPars.execute();

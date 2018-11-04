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
const hello = {
    description: "Speciale test Number",
    defaultVal: "hello",
    shortcut: "n"
};
const silent = {
    description: "Speciale test boolean",
    defaultVal: true,
    shortcut: "b"
};

const argPars = new ArgParser("0.1.0");
// argPars.addCommand("version", version);
argPars.addCommand("hello", hello, () => {
    console.log("Hello world");
});
argPars.addCommand("silent", silent);
// argPars.addCommand("h", "help", "print help");
// argPars.addCommand("v", "version", "Give acrtual version of the module");
// argPars.addCommand("t", "test", "Speciale test");
const parsedArg = argPars.parse();
console.log(parsedArg);
// console.log(argPars);
// argPars.hello();
// console.log(argPars.parse());

// argPars.help();
// argPars.getVersion();

argPars.execute();

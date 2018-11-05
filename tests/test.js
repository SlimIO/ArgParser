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
    shortcut: "b"
};
const dupli = {
    description: "duplicate",
    shortcut: "b"
}
const argPars = new ArgParser("0.1.0");
argPars.addCommand("special", special);
argPars.addCommand("hello", hello);
argPars.addCommand("silent", silent);
// argPars.addCommand("dupli", dupli);
console.log(argPars.listShortcut);

// console.log(argPars.listCmd);
    // const iterator = argPars.listCmd[Symbol.iterator]() 
    // for (const [key, value] of iterator) {
    //     console.log(`${key} - ${value.shortcut}`);
        
    // }

// argPars.addCommand("h", "help", "print help");
// argPars.addCommand("v", "version", "Give acrtual version of the module");
// argPars.addCommand("t", "test", "Speciale test");

// argPars.parse();
// console.log(parsedArg);
// console.log(argPars);

// argPars.hello();
// console.log(argPars.parse());

// argPars.help();

// argPars.execute();

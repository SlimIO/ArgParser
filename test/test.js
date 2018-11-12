// Require internal Dependenties
const ArgParser = require("../src/argParser.class");
// Require Node.js Dependenties

// Require third-party Dependenties
const ava = require("ava");


ava("AddCommand: throw error, argument name required", (assert) => {
    const argPars = new ArgParser("0.1.0");
    const errorNamedCommand = assert.throws(() => {
        argPars.addCommand();
    }, Error);
    assert.is(errorNamedCommand.message, "you must name your command");
});

ava("AddCommand: throw TypeError, argument name must be a string", (assert) => {
    const argPars = new ArgParser("0.1.0");
    const NameString = assert.throws(() => {
        argPars.addCommand(21, {});
    }, TypeError);
    assert.is(NameString.message, "name param must be a string");
});

ava("AddCommand: throw TypeError, argument options.shortcut must be a string", (assert) => {
    const argPars = new ArgParser("0.1.0");
    const nameString = assert.throws(() => {
        argPars.addCommand("test", {
            shortcut: 1
        });
    }, TypeError);
    assert.is(nameString.message, "options.shortcut param must be a string");
});

ava("addCommand: throw typeError, options.type param must be a string", (assert) => {
    const argPars = new ArgParser("0.1.0");
    const typeStr = assert.throws(() => {
        argPars.addCommand("test", {
            type: 1
        });
    }, TypeError);
    assert.is(typeStr.message, "options.type param must be a string");
});

ava("addCommand: throw typeError, options.description param must be a string", (assert) => {
    const argPars = new ArgParser("0.1.0");
    const descrStr = assert.throws(() => {
        argPars.addCommand("test", {
            description: 1
        });
    }, TypeError);
    assert.is(descrStr.message, "options.description param must be a string");
});

ava("AddCommand: Duplicate command name", (assert) => {
    const argPars = new ArgParser("0.1.0");
    const DupliCmdName = assert.throws(() => {
        argPars.addCommand("test", {});
        argPars.addCommand("test", {});
    }, Error);
    assert.is(DupliCmdName.message, "Duplicate command nammed \"test\"");
});

ava("AddCommand: Duplicate shortcut", (assert) => {
    const argPars = new ArgParser("0.1.0");
    const DupliCmdName = assert.throws(() => {
        argPars.addCommand("test", { shortcut: "x" });
        argPars.addCommand("testy", { shortcut: "x" });
    }, Error);
    assert.is(DupliCmdName.message, "Duplicate shortcut nammed \"x\"");
});


// ava("Name argument missing in addCommand method", (assert) => {
//     assert.pass();
// });
/*
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


argPars.addCommand("number", number);
argPars.addCommand("hello", hello);
argPars.addCommand("silent", silent);
argPars.addCommand("fizz", buzz);

// console.log(argPars.shortcuts);
const result = argPars.parse();
console.log(result);
// console.log(argPars.parsedArg);
// console.log(argPars.commands);
*/

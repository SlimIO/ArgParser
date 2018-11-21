// Require Node.js Dependenties
const { join } = require("path");

// Require Third-party Dependenties
const ava = require("ava");

// Require Internal Dependencies
const ArgParser = require("../src/argParser.class");

// CONSTANTS
const PKG_PATH = join(__dirname, "package.json");
const DEFAULT_CMD = {
    shortcut: "l",
    type: "string",
    description: ""
};

ava("constructor: missed version argument", (assert) => {
    const err = assert.throws(() => {
        new ArgParser();
    }, Error);
    assert.is(err.message, "You must precise the version of argParse used");
});

ava("constructor: missed packagePath argument", (assert) => {
    const err = assert.throws(() => {
        new ArgParser("0.1.0");
    }, Error);
    assert.is(err.message, "You must precise the path of the package.json file");
});

ava("AddCommand: throw TypeError, argument name must be a string", (assert) => {
    const argPars = new ArgParser("0.1.0", PKG_PATH);
    const errorNamedCommand = assert.throws(() => {
        argPars.addCommand();
    }, TypeError);
    assert.is(errorNamedCommand.message, "name param must be a string");
});

ava("AddCommand: throw TypeError, argument options.shortcut must be a string", (assert) => {
    const argPars = new ArgParser("0.1.0", PKG_PATH);
    const nameString = assert.throws(() => {
        argPars.addCommand("test", {
            shortcut: 1
        });
    }, TypeError);
    assert.is(nameString.message, "options.shortcut param must be a string");
});

ava("addCommand: throw typeError, options.type param must be a string", (assert) => {
    const argPars = new ArgParser("0.1.0", PKG_PATH);
    const typeStr = assert.throws(() => {
        argPars.addCommand("test", {
            shortcut: "l",
            type: 1
        });
    }, TypeError);
    assert.is(typeStr.message, "options.type param must be a string");
});

ava("addCommand: throw typeError, options.description param must be a string", (assert) => {
    const argPars = new ArgParser("0.1.0", PKG_PATH);
    const descrStr = assert.throws(() => {
        argPars.addCommand("test", {
            shortcut: "l",
            type: "string",
            description: 1
        });
    }, TypeError);
    assert.is(descrStr.message, "options.description param must be a string");
});

ava("AddCommand: Duplicate command name", (assert) => {
    const argPars = new ArgParser("0.1.0", PKG_PATH);
    const DupliCmdName = assert.throws(() => {
        argPars.addCommand("test", DEFAULT_CMD);
        argPars.addCommand("test", DEFAULT_CMD);
    }, Error);
    assert.is(DupliCmdName.message, "Duplicate command nammed \"test\"");
});

ava("AddCommand: Duplicate shortcut", (assert) => {
    const argPars = new ArgParser("0.1.0", PKG_PATH);
    const DupliCmdName = assert.throws(() => {
        argPars.addCommand("test", DEFAULT_CMD);
        argPars.addCommand("testy", DEFAULT_CMD);
    }, Error);
    assert.is(DupliCmdName.message, "Duplicate shortcut nammed \"l\"");
});

ava("Parse: Hello World", (assert) => {
    const argPars = new ArgParser("0.1.0", PKG_PATH);
    const hello = {
        description: "Say hello World",
        defaultVal: "hello World",
        shortcut: "hw"
    };
    argPars.addCommand("hello", hello);
    const expected = new Map([
        ["hello", "Hello World"]
    ]);
    const result = argPars.parse(["--hello", "Hello World"]);
    // console.log(argPars.parse(["--hello", "Hello World"]));
    assert.deepEqual(result, expected);
});

ava("Parse: shortcut & multiple arg", (assert) => {
    const argPars = new ArgParser("0.1.0", PKG_PATH);
    const shortcut = {
        description: "shortcut",
        defaultVal: "shortcut",
        shortcut: "s"
    };
    argPars.addCommand("shortcut", shortcut);
    const expected = new Map([
        ["shortcut", ["20", "50"]]
    ]);
    const result = argPars.parse(["-s", "20", "50"]);
    assert.deepEqual(result, expected);
});

ava("Parse: Command with no arg", (assert) => {
    const argPars = new ArgParser("0.1.0", PKG_PATH);
    const noArg = {
        description: "No Args",
        shortcut: "n"
    };
    argPars.addCommand("noArg", noArg);
    const expected = new Map([
        ["noArg", true]
    ]);
    const result = argPars.parse(["-n"]);
    assert.deepEqual(result, expected);
});

ava("Parse: throw TypeError type expected number and get a string", (assert) => {
    const argPars = new ArgParser("0.1.0", PKG_PATH);
    const type = {
        description: "Give a type",
        defaultVal: 25,
        type: "number"
    };
    argPars.addCommand("type", type);
    const error = assert.throws(() => {
        argPars.parse(["--type", "Wrong arg type", "--fakeCmd"]);
    }, TypeError);
    assert.is(error.message, "Arguments of type must be type of number");
});

ava("Parse: throw TypeError type expected String and get a Number", (assert) => {
    const argPars = new ArgParser("0.1.0", PKG_PATH);
    const type = {
        description: "Give a type",
        defaultVal: 50,
        type: "string"
    };
    argPars.addCommand("type", type);
    const err = assert.throws(() => {
        argPars.parse(["--type"]);
    }, TypeError);
    assert.is(err.message, "Arguments of type must be type of string");
});

ava("parse: fake command", (assert) => {
    const argPars = new ArgParser("0.1.0", PKG_PATH);
    argPars.parse(["--fakeCmd", "--fakecmd2"]);
    assert.pass();
});

// Path to package.json problem : no such file or directory ....
ava("help method", (assert) => {
    const argPars = new ArgParser("0.1.0", PKG_PATH);

    const hello = {
        description: "Say hello World",
        defaultVal: "hello World",
        shortcut: "hw"
    };
    argPars.addCommand("hello", hello);
    argPars.help(PKG_PATH);
    assert.pass();
});

ava("help without path to package.json", (assert) => {
    const argPars = new ArgParser("0.1.0", PKG_PATH);
    const error = assert.throws(() => {
        argPars.help();
    }, Error);
    assert.is(error.message, "You must specify the path to the package");
});

// Version et help test problem : process.exit(0)
// ava("Parse : version", (assert) => {
//     const argPars = new ArgParser("0.1.0", PKG_PATH);
//     // const y = assert.notThrows(, "Message");
//     // console.log(y);
//     argPars.parse(["--version"]);
//     assert.pass();
// });

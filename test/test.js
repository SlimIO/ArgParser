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

ava("AddCommand: throw TypeError, argument name must be a string", (assert) => {
    const argPars = new ArgParser("0.1.0", PKG_PATH);
    const errorNamedCommand = assert.throws(() => {
        argPars.addCommand();
    }, TypeError);
    assert.is(errorNamedCommand.message, "name param must be a string");
});

ava("addCommand: TypeError, option is a plainObject", (assert) => {
    const argPars = new ArgParser("0.1.0", PKG_PATH);
    const err = assert.throws(() => {
        argPars.addCommand("name", "not Plain Ojbect");
    });
    assert.is(err.message, "options should be a plain JavaScript Object!");
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

ava("addCommand: verify command type", (assert) => {
    const argPars = new ArgParser("0.1.0");
    const options = {
        shortcut: "",
        description: "",
        type: "wrongType"
    };
    const err = assert.throws(() => {
        argPars.addCommand("typeVerif", options);
    });
    assert.is(err.message, "wrongType is not a recognized type");
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
    const options = {
        description: "Say hello World",
        defaultVal: "hello World",
        shortcut: "hw",
        type: "string"
    };
    argPars.addCommand("hello", options);
    const expected = new Map([
        ["hello", "Hello World"]
    ]);
    const result = argPars.parse(["--hello", "Hello World"]);
    // console.log(argPars.parse(["--hello", "Hello World"]));
    assert.deepEqual(result, expected);
});

ava("Parse: shortcut & multiple arg", (assert) => {
    const argPars = new ArgParser("0.1.0", PKG_PATH);
    const options = {
        description: "shortcut",
        defaultVal: "shortcut",
        shortcut: "s",
        type: "array"
    };
    argPars.addCommand("shortcut", options);
    const expected = new Map([
        ["shortcut", ["20", "50"]]
    ]);
    const result = argPars.parse(["-s", "20", "50"]);
    assert.deepEqual(result, expected);
});

ava("Parse: Command with no arg", (assert) => {
    const argPars = new ArgParser("0.1.0", PKG_PATH);
    const options = {
        description: "No Args",
        shortcut: "n",
        type: "boolean"
    };
    argPars.addCommand("noArg", options);
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
        shortcut: "p",
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
        shortcut: "y",
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
// ava("help method", (assert) => {
//     const argPars = new ArgParser("0.1.0", "Desc du package");

//     const hello = {
//         description: "Say hello World",
//         defaultVal: "hello World",
//         shortcut: "hw",
//         type: "string"
//     };
//     argPars.addCommand("hello", hello);
//     argPars.showHelp(PKG_PATH);
//     assert.pass();
// });

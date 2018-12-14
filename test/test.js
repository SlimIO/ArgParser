// Require Third-party Dependenties
const ava = require("ava");
const is = require("@slimio/is");

// Require Internal Dependencies
const ArgParser = require("../src/argParser.class");

ava("assert exported functions", (assert) => {
    assert.true(is.plainObject(ArgParser));
    assert.true(Reflect.has(ArgParser, "argDefinition"));
    assert.true(Reflect.has(ArgParser, "parseArg"));
});

ava("argDefinition: should throw 'Unable to parse command'", (assert) => {
    const err = assert.throws(() => {
        ArgParser.argDefinition("zabllla");
    }, Error);
    assert.is(err.message, "Unable to parse command");
});

ava("argDefinition: assert new entry", (assert) => {
    const entry = ArgParser.argDefinition("-p --product [number]", "Product command!");

    assert.is(entry.name, "product");
    assert.is(entry.description, "Product command!");
    assert.is(entry.shortcut, "p");
    assert.is(entry.defaultVal, undefined);
    assert.is(entry.type, "number");
});

ava("argDefinition: assert new entry without shortcut and description", (assert) => {
    const entry = ArgParser.argDefinition("--product [number=10]");

    assert.is(entry.name, "product");
    assert.is(entry.description, "");
    assert.is(entry.shortcut, undefined);
    assert.is(entry.defaultVal, 10);
    assert.is(entry.type, "number");
});

ava("parseArg: should throw 'argv must be an array'", (assert) => {
    const err = assert.throws(() => {
        ArgParser.parseArg(void 0, 10);
    }, TypeError);
    assert.is(err.message, "argv must be an array");
});

ava("parseArg: without any commands", (assert) => {
    const result = ArgParser.parseArg(void 0, []);
    assert.true(is.map(result));
    assert.is(result.size, 0);
});

ava("parse: with two commands", (assert) => {
    const cmdDef = [
        ArgParser.argDefinition("-p --product [number=10]"),
        ArgParser.argDefinition("-t --truc [string]")
    ];

    const result = ArgParser.parseArg(cmdDef, ["-p", "--truc", "hello world"]);
    assert.true(is.map(result));
    assert.is(result.size, 2);
    assert.is(result.get("product"), 10);
    assert.is(result.get("truc"), "hello world");
});

ava("parse: boolean command", (assert) => {
    const cmdDef = [ArgParser.argDefinition("-p --product")];

    const v1 = ArgParser.parseArg(cmdDef, ["-p"]);
    assert.true(v1.get("product"));

    const v2 = ArgParser.parseArg(cmdDef, []);
    assert.false(v2.get("product"));
});

ava("parse: array command", (assert) => {
    const cmdDef = [ArgParser.argDefinition("-c --colors [array]")];

    const colors = ["blue", "red", "yellow"];
    const result = ArgParser.parseArg(cmdDef, ["-c", ...colors]);
    assert.true(result.has("colors"));

    assert.deepEqual(result.get("colors"), colors);
});

ava("parse: should throw a type error", (assert) => {
    const cmdDef = [ArgParser.argDefinition("--product [number]")];

    const err = assert.throws(() => {
        ArgParser.parseArg(cmdDef, ["--product", "hello"]);
    }, Error);
    assert.is(err.message, "<product> CLI argument must be type of number");
});

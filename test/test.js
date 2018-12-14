// Require Third-party Dependenties
const ava = require("ava");
const is = require("@slimio/is");

// Require Internal Dependencies
const ArgParser = require("../src/argParser.class");

ava("constructor: assert default property", (assert) => {
    const parser = new ArgParser();

    assert.true(is.map(parser.commands));
    assert.true(is.map(parser.shortcuts));
    assert.is(parser.commands.size, 0);
    assert.is(parser.shortcuts.size, 0);
});

ava("addCommand: should throw 'Unable to parse command'", (assert) => {
    const parser = new ArgParser();
    const err = assert.throws(() => {
        parser.addCommand("zabllla");
    }, Error);
    assert.is(err.message, "Unable to parse command");
});

ava("addCommand: should throw 'description must be a string'", (assert) => {
    const parser = new ArgParser();
    const err = assert.throws(() => {
        parser.addCommand("", 10);
    }, TypeError);
    assert.is(err.message, "description must be a string");
});

ava("addCommand: assert new entry", (assert) => {
    const parser = new ArgParser();

    parser.addCommand("-p --product [number]", "Product command!");

    assert.is(parser.commands.size, 1);
    assert.true(parser.commands.has("product"));
    assert.true(parser.shortcuts.has("p"));
    assert.is(parser.shortcuts.get("p"), "product");

    const entry = parser.commands.get("product");
    assert.is(entry.description, "Product command!");
    assert.is(entry.shortcut, "p");
    assert.is(entry.defaultVal, undefined);
    assert.is(entry.type, "number");
});

ava("addCommand: assert new entry without shortcut and description", (assert) => {
    const parser = new ArgParser();

    parser.addCommand("--product [number=10]");
    assert.is(parser.shortcuts.size, 0);
    assert.false(parser.shortcuts.has("p"));

    const entry = parser.commands.get("product");
    assert.is(entry.description, "");
    assert.is(entry.shortcut, undefined);
    assert.is(entry.defaultVal, 10);
    assert.is(entry.type, "number");
});

ava("addCommand: same shortcut twice should throw an error", (assert) => {
    const parser = new ArgParser();

    parser.addCommand("-p --product");
    const err = assert.throws(() => {
        parser.addCommand("-p --police");
    }, Error);
    assert.is(err.message, "Duplicate shortcut nammed \"p\"");

    assert.is(parser.shortcuts.size, 1);
    assert.is(parser.commands.size, 1);
    assert.true(parser.commands.has("product"));
    assert.false(parser.commands.has("police"));
});

ava("parse: should throw 'dargv must be an array'", (assert) => {
    const parser = new ArgParser();
    const err = assert.throws(() => {
        parser.parse(10);
    }, TypeError);
    assert.is(err.message, "argv must be an array");
});

ava("parse: without any commands", (assert) => {
    const parser = new ArgParser();

    const result = parser.parse([]);
    assert.true(is.map(result));
    assert.is(result.size, 0);
});

ava("parse: with two commands", (assert) => {
    const parser = new ArgParser()
        .addCommand("-p --product [number=10]")
        .addCommand("-t --truc [string]");

    const result = parser.parse(["-p", "--truc", "hello world"]);
    assert.true(is.map(result));
    assert.is(result.size, 2);
    assert.is(result.get("product"), 10);
    assert.is(result.get("truc"), "hello world");
});

ava("parse: boolean command", (assert) => {
    const parser = new ArgParser()
        .addCommand("-p --product");

    const v1 = parser.parse(["-p"]);
    assert.true(v1.get("product"));

    const v2 = parser.parse([]);
    assert.false(v2.get("product"));
});

ava("parse: array command", (assert) => {
    const parser = new ArgParser()
        .addCommand("-c --colors [array]");

    const colors = ["blue", "red", "yellow"];
    const result = parser.parse(["-c", ...colors]);
    assert.true(result.has("colors"));

    assert.deepEqual(result.get("colors"), colors);
});

ava("parse: should throw a type error", (assert) => {
    const parser = new ArgParser()
        .addCommand("--product [number]");

    const err = assert.throws(() => {
        parser.parse(["--product", "hello"]);
    }, Error);
    assert.is(err.message, "<product> CLI argument must be type of number");
});

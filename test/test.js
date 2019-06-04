// Require Node Dependencies
const { spawn } = require("child_process");

// Require Third-party Dependenties
const ava = require("ava");
const is = require("@slimio/is");

// Require Internal Dependencies
const ArgParser = require("..");

ava("assert exported functions", (assert) => {
    assert.true(is.plainObject(ArgParser));
    assert.true(Reflect.has(ArgParser, "argDefinition"));
    assert.true(Reflect.has(ArgParser, "parseArg"));
});

ava("argDefinition: should throw 'Unable to parse command'", (assert) => {
    assert.throws(() => {
        ArgParser.argDefinition("zabllla");
    }, { instanceOf: Error, message: "Unable to parse command" });
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
    assert.throws(() => {
        ArgParser.parseArg(void 0, 10);
    }, { instanceOf: TypeError, message: "argv must be an array" });
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

ava("parse: array command with defaultVal []", (assert) => {
    {
        const cmdDef = [ArgParser.argDefinition("-c --colors [array=[]]")];

        const result = ArgParser.parseArg(cmdDef, ["-c"]);
        assert.true(result.has("colors"));
        assert.deepEqual(result.get("colors"), []);
    }
    {
        const cmdDef = [ArgParser.argDefinition("-c --colors [array=[\"test\"]]")];

        const result = ArgParser.parseArg(cmdDef, ["-c"]);
        assert.true(result.has("colors"));
        assert.deepEqual(result.get("colors"), ["test"]);
    }
});

ava("parse: array command with only one element into it", (assert) => {
    const cmdDef = [ArgParser.argDefinition("-i --ignore [array]")];

    const ignoredFile = "file.txt";
    const result = ArgParser.parseArg(cmdDef, ["-i", ignoredFile]);
    assert.true(result.has("ignore"));

    assert.deepEqual(result.get("ignore"), [ignoredFile]);
});

ava("parse: should throw a type error", (assert) => {
    const cmdDef = [ArgParser.argDefinition("--product [number]")];

    assert.throws(() => {
        ArgParser.parseArg(cmdDef, ["--product", "hello"]);
    }, { instanceOf: Error, message: "<product> CLI argument must be type of number" });
});

ava("parse: string/number defaultVal shouldn't appear if not called", (assert) => {
    const cmdDef = [
        ArgParser.argDefinition("--product [string=slimio]"),
        ArgParser.argDefinition("--price [number=1000000000]")
    ];

    let result = ArgParser.parseArg(cmdDef, ["--product"]);
    assert.true(result.has("product"));
    assert.false(result.has("price"));
    assert.is(result.get("product"), "slimio");

    result = ArgParser.parseArg(cmdDef, ["--price"]);
    assert.false(result.has("product"));
    assert.true(result.has("price"));
    assert.is(result.get("price"), 1000000000);

    result = ArgParser.parseArg(cmdDef, []);
    assert.is(result.size, 0);
});

ava("help: There is currently no command repertoried", async(assert) => {
    const help = spawn("node", ["test/spawn/help.js"]);

    await new Promise((resolve, reject) => {
        let fullLog = "";
        help.stdout.on("data", (data) => {
            fullLog += data.toString("utf-8");
        });

        help.on("error", reject);

        help.on("close", () => {
            assert.is(fullLog, "There is currently no command repertoried\n");
            resolve();
        });
    });
});

ava("help: with commands", async(assert) => {
    const help = spawn("node", ["test/spawn/help2.js"]);

    await new Promise((resolve, reject) => {
        let fullLog = "";
        help.stdout.on("data", (data) => {
            fullLog += data.toString("utf-8");
        });

        help.on("error", reject);

        help.on("close", () => {
            let expected = "\n";
            expected += "Usage :\n";
            expected += "\t- node file.js <command>\n";
            expected += "\t- node file.js <command> <value>\n";
            expected += "\n";
            expected += "<command>     <type>   <default>  <description>\n";
            expected += "-p --product  number   10         Product number description\n";
            expected += "-t --truc     string              \n";
            expected += "--bidule      boolean  false      \n";
            expected += "--chouette    boolean  true       \n";

            assert.is(fullLog, expected);
            resolve();
        });
    });
});

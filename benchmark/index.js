"use strict";

const { argDefinition, parseArg } = require("../");
const Benchmark = require("benchmark");

// [De-]optimize method
argDefinition("-p --product [number=10]", "Description");
argDefinition("-p --product [number=10]", "Description");

console.log("Testing argDefinition_t1 on 1,000 iteration!");
console.time("argDefinition_t1");
for (let id = 0; id < 1000; id++) {
    argDefinition("-p --product [number=10]", "Description");
}
console.timeEnd("argDefinition_t1");

console.log("\n\nTesting argDefinition_t2 on 1,000 iteration!");
console.time("argDefinition_t2");
for (let id = 0; id < 1000; id++) {
    argDefinition("--product");
}
console.timeEnd("argDefinition_t2");

console.log("\n\nTesting parsing_v1 on 10,000 iteration!");
{
    const defs = [
        argDefinition("--product [number=10]"),
        argDefinition("--verbose"),
        argDefinition("-f --fastboot"),
        argDefinition("-c --colors [array]")
    ];
    const argv = ["--product", "10", "-f", "--colors", "red", "blue", "yellow"];

    // [De-]optimize method
    parseArg(defs, argv);
    parseArg(defs, argv);

    console.time("parsing_v1");
    for (let id = 0; id < 10000; id++) {
        parseArg(defs, argv);
    }
    console.timeEnd("parsing_v1");

    console.log("\n");
    const suite = new Benchmark.Suite();
    suite
        .add("parsing", () => parseArg(defs, argv))
        .on("cycle", (ex) => console.log(String(ex.target)))
        .run();
}

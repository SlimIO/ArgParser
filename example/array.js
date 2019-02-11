const { parseArg, argDefinition } = require("../");

const result = parseArg([
    argDefinition("-c --colors [array]", "Array of colors"),
    argDefinition("-i --integer [number=1]")
]);

console.log(result);

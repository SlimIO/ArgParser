const { parseArg, argDefinition } = require("../");

const result = parseArg([
    argDefinition("--verbose", "Enable verbose mode!"),
    argDefinition("-a --autoreload [number=500]", "Configuration Autoreload delay in number")
]);

console.log(result);

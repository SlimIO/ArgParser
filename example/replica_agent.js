const ArgParser = require("../");

const result = new ArgParser("v1.0.0", "SlimIO Agent CLI Utility")
    .addCommand("--verbose", "Enable verbose mode!")
    .addCommand("-a --autoreload [number=500]", "Configuration Autoreload delay in number")
    .parse();

console.log(result);

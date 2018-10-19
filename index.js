const ArgParser = require("./src/argParser.class");

// console.log(`Instanciation ArgParser`);
const argPars = new ArgParser();

// console.log(`x.args : ${x.args}`);
argPars.addOption("h", "help", "print help");
argPars.addOption("v", "version", "Give acrtual version of the module");
argPars.addOption("t", "test", "Speciale test");
argPars.parse();
// argPars.options.forEach((val, ind) => {
//     console.log(`val ${ind}`);
//     console.log(val);
    
// });
// argPars.parse();
// for (const y of argPars.options) {
//     console.log(`x.opts forof : ${y}`);
//     console.log(y);
// }
// argPars.help();

// module.exports = ArgParser;

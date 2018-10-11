const ArgParser = require("./src/argParser.class");

console.log(`Instanciation ArgParser`);
const x = new ArgParser();

// console.log(`x.args : ${x.args}`);
x.addOption("h", "help", "print help");
x.addOption("v", "version", "Give version ");
// x.parse();
// x.options.forEach((val, ind) => {
//     console.log(`val ${ind}`);
//     console.log(val);
    
// });
// x.parse();
for (const y of x.options) {
    console.log(`x.opts forof : ${y}`);
    console.log(y);
}
x.help();

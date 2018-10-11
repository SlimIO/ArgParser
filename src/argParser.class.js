
// Require Node.JS dependencies
const { readFile } = require("fs");

/**
 * @class ArgParser
 */
class ArgParser {

    /**
     * @constructor
     */
    constructor(name) {
        /** @type {Array} */
        this.args = process.argv.slice(2);
        this.options = [];
        console.log(this.args);

        // associer les noms des methodes avec les noms des options déclarés 
    }
    /** Verify if arguments passed in command line are executable */
    parse() {
        console.log(`this.args : ${this.args}`);

        // parser les arguments en ligne de commande et les confrontés avec la liste des options définies
    }


    /**
     * 
     * @param {String} shortcut  - shortcut of argument
     * @param {String} name - name of argument
     * @param {String} description - description of what the argument provide
     */
    addOption(shortcut, name, description) {
        //gerer les erreurs 
        this.options.push({ shortcut, name, description });
    }

    /** displays information about all the arguments that the module takes in the console*/
    help() {
        readFile("./package.json", (err, data) => {
            if (err) throw new Error(err)
            const { name, description } = JSON.parse(data);
            const nbespace = 10;
            let printMess = `Usage: ${name} [option]\n\n${description}\n\noptions:\n`;
            let maxLengthOfDesc = 0;
            this.options.map(opt => maxLengthOfDesc = (maxLengthOfDesc < opt.name.length) ? opt.name.length : maxLengthOfDesc)
            for (const option of this.options) {
                const nbWhiteSpace = maxLengthOfDesc + 3 - option.name.length;
                const whiteSpace = new Array(nbWhiteSpace).join(" ");
                printMess += `  -${option.shortcut}, --${option.name}${whiteSpace}${option.description}\n`
            }
            console.log(printMess);
        });
    }
}

module.exports = ArgParser;
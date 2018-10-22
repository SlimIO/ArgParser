
// Require Node.JS dependencies
const {
    promises: {
        readFile,
        access
    },
    constants: {
        R_OK
    } } = require("fs");
const { parse, join } = require("path");
 
// Require Third-party dependencies
const is = require("@slimio/is");
// const { read } = require("@slimio/utils");

/**
 * @class ArgParser
 */
class ArgParser {

    /**
     * @constructs ArgParser
     */
    constructor() {
        /** Arguments passed in command line
         * @type {String[]}
         * @memberof ArgParser#
         * */
        this.args = process.argv.slice(2);
        /** Array of options added to an addon with addOption() function.
         * Every options added to an addon refers to an argument action
         * @type {Array<T>}
         */
        this.options = [];

        const { dir } = parse(__dirname);
        /** path to Package.json
         * @type {String}
         */
        this.packageJsonPath = join(dir, "package.json");

        // associer les noms des methodes avec les noms des options déclarés
    }

    /** Verify if arguments passed in command line are executable
     * @return {void}
     * @throws {Error}
     */
    parse() {
        // parser les arguments en ligne de commande et les confrontés avec la liste des options définies
        if (this.args.length === 0) {
            return;
        }
        if (this.options.length === 0) {
            throw new Error("There is no options, you have to add option with addOption() method befor using parse() methode");
        }
        // console.log(this.args);
        // permet de retirer les tirets des arguments
        this.args = this.args.map((val) => {
            // console.log(val);
            let result = "";
            if (/^-{2}/g.test(val)) {
                // console.log("il y a deux tirets");
                result = val.slice(2);
            }
            if (/^-[^-]/g.test(val)) {
                // console.log("il y a un tirets");
                result = val.slice(1);
            }

            return result;
        });
        // await read(this.packageJsonPath)
        // const myvar = await this.readPackageJson();
        // console.log(`Myvar: ${JSON.stringify(myvar)}`);

        for (const argument of this.args) {
            // console.log(argument);
            switch (argument) {
                case "t":
                case "test":
                    this.test();
                    break;
                case "v":
                case "version":
                    this.version();
                    break;
                case "h":
                case "help":
                    this.help();
                    break;
                default:
                    throw new Error("");
            }
        }
    }

    /**
     * add options with a name, shortcut [description] that will be used as comparisons with the arguments inserted in the command line
     * the name of the argument must match with the name of the associated function
     * @param {String} shortcut shortcut of argument
     * @param {String} name name of argument must
     * @param {String} description description of what the argument provide
     * @returns {void}
     * @throws {TypeError}
     */
    addOption(shortcut, name, description) {
        // Manage Errors
        if (!is.string(shortcut)) {
            throw new TypeError("shortcut param must be a string");
        }
        if (!is.string(name)) {
            throw new TypeError("name param must be a string");
        }
        if (!is.string(description) && is.nullOrUndefined(description)) {
            throw new TypeError("description param must be a string");
        }
        this.options.push({ shortcut, name, description });
    }

    /** displays informations about the addon and all the arguments that the addon can take in the console
     * @function help
     * @return {Promise}
    */
    async help() {
        // read the package.json to get name of addon and his description & print it
        await access(this.packageJsonPath, R_OK);
        const data = await readFile(this.packageJsonPath, { encoding: "utf8" });
        const { name, description } = JSON.parse(data);
        console.log(`Usage: ${name} [option]\n\n${description}\n\noptions:`);

        let maxLengthName = 0;
        // browse table to get max lenth of name option to deduce number of white space
        for (const option of this.options) {
            if (maxLengthName < option.name.length) {
                maxLengthName = option.name.length;
            }
        }
        // print every option on terminal
        for (const option of this.options) {
            const whiteSpace = " ".repeat(maxLengthName - option.name.length);
            console.log(`\t-${option.shortcut}, --${option.name} ${whiteSpace} ${option.description}`);
        }
    }

    /** Give the actual version of the addon
     * @returns {void}
     */
    async version() {
        await access(this.packageJsonPath, R_OK);
        const data = await readFile(this.packageJsonPath, { encoding: "utf8" });
        const { version } = JSON.parse(data);
        console.log(`v${version}`);
    }
}

module.exports = ArgParser;

// Require Node.JS dependencies
const { readFileSync } = require("fs");
const { join } = require("path");

// Require Third-party dependencies
const is = require("@slimio/is");

/** This callback is called `commandFctCallback` and execute the associated function of specifique command
 * @callback commandFctCallback
 */

/**
 * @class ArgParser
 * @classdesc Parse arguments in command line for SlimIO projects
 *
 * @property {Map} commands all commands define by developper
 * @property {Map} shortcuts Map of existing shortcut with name associated
 * @property {Map} parsedArgs List represent parsed arguments command line
 * @property {String} version Current version of ArgParser
 *
 * @version 0.1.0
 */
class ArgParser {
    /**
     * @constructs ArgParser
     * @param {String} version Set version
     */
    constructor(version) {
        this.commands = new Map();
        this.shortcuts = new Map();
        this.parsedArg = new Map();
        this.version = version;
    }

    /**
     * Adds a command to the existing command list
     *
     * @param {!String} name name of command
     * @param {Object} options Object represent
     * @param {String} options.description description of what the argument provide
     * @param {String|Number|Boolean} options.defaultVal defalt value of the command
     * @param {String=} options.shortcut shortcut of argument
     * @throws {TypeError}
     *
     * @returns {void}
     *
     * @version 0.1.0
     */
    addCommand(name, options) {
        // Manage Errors
        if (is.nullOrUndefined(name)) {
            throw new Error("you must name your command");
        }
        if (!is.string(name)) {
            throw new TypeError("name param must be a string");
        }
        if (!is.string(options.shortcut)) {
            throw new TypeError("shortcut param must be a string");
        }
        if (!is.string(options.description) && is.nullOrUndefined(options.description)) {
            throw new TypeError("description param must be a string");
        }

        // check duplicate name
        if (this.commands.has(name)) {
            throw new Error(`Duplicate command nammed "${name}"`);
        }
        // check duplicate shortcut
        if (this.shortcuts.has(options.shortcut)) {
            throw new Error(`duplicate shortcut nammed "${options.shortcut}"`);
        }

        this.shortcuts.set(options.shortcut, name);
        this.commands.set(name, options);
    }

    /** Parse and verify if arguments passed in command line are executable
     * @param {String[]} [argv] list of command inputted
     * @throws {Error}
     *
     * @returns {void}
     *
     * @version 0.1.0
     */
    parse(argv = process.argv.slice(2)) {
        let currCmd = null;
        let values = [];
        // const usedShortCut= new Set();

        const writeCommand = () => {
            const val = values.length === 1 ? values[0] : values;
            // replace shortcut by command name
            const key = this.shortcuts.has(currCmd) ? this.shortcuts.get(currCmd) : currCmd;
            this.parsedArg.set(key, values.length === 0 ? true : val);
            values = [];
        };

        for (const arg of argv) {
            if (/^-{1,2}/g.test(arg)) {
                if (currCmd !== null) {
                    writeCommand();
                }
                currCmd = arg.replace(/-/g, "");
            }
            else {
                values.push(arg);
            }
        }
        writeCommand();
    }

    /** displays informations about the addon and all the arguments that the addon can take in the console
     * @param {String} [packageJson=null] Path to package.json
     * @function help
     * @return {void}
     * @version 0.1.0
    */
    help() {
        const packageJson = join(__dirname, "package.json");        
        // read the package.json to get name of addon and his description & print it
        const data = readFileSync(packageJson, { encoding: "utf8" });
        const { name, description } = JSON.parse(data);
        console.log(`Usage: ${name} [option]\n\n${description}\n\noptions:`);
        // print every option on terminal
        for (const command of this.commands) {
            console.log(`\t-${command.shortcut}, --${command.name}`);
            console.log(`\t\t${command.description}`);
        }
    }
}

module.exports = ArgParser;

// Require Node.JS dependencies
const { readFileSync } = require("fs");
const { join } = require("path");

// Require Third-party dependencies
const is = require("@slimio/is");

/**
 * @class ArgParser
 * @classdesc Parse arguments in command line for SlimIO projects
 *
 * @property {Map} commands all commands accepted to be parsed. Commands are define by developper.
 * @property {Map} shortcuts all existing shortcut with name associated to avoid duplicating them.
 * @property {String} version Current version of ArgParser.
 *
 * @version 0.1.0
 */
class ArgParser {
    /**
     * @constructs ArgParser
     * @param {!String} version Set version
     *
     * @throws {Error}
     *
     */
    constructor(version) {
        this.commands = new Map();
        this.shortcuts = new Map([
            ["h", "help"],
            ["v", "version"]
        ]);
        if (is.nullOrUndefined(version)) {
            throw new Error("You must precise the version of argParse used");
        }
        this.version = version;
    }

    /**
     * Adds a command to the existing command list
     *
     * @param {!String} name name of command
     *
     * @param {Object=} options Object represent options for command line
     * @param {String=} options.description Description of what the argument provide
     * @param {String=} options.shortcut Shortcut of argument
     * @param {String|Number|Boolean=} options.defaultVal Defalt value of the command
     * @param {String=} options.type Argument type of commands. Must be in lower case
     *
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

        // check duplicate name
        if (this.commands.has(name)) {
            throw new Error(`Duplicate command nammed "${name}"`);
        }

        if (!is.nullOrUndefined(options)) {

            if (!is.string(options.shortcut) && !is.nullOrUndefined(options.shortcut)) {
                throw new TypeError("options.shortcut param must be a string");
            }
            if (!is.string(options.type) && !is.nullOrUndefined(options.type)) {
                throw new TypeError("options.type param must be a string");
            }
            if (!is.string(options.description) && !is.nullOrUndefined(options.description)) {
                throw new TypeError("options.description param must be a string");
            }

            // check duplicate shortcut
            if (this.shortcuts.has(options.shortcut)) {
                throw new Error(`Duplicate shortcut nammed "${options.shortcut}"`);
            }

            this.shortcuts.set(options.shortcut, name);
        }

        this.commands.set(name, options);
    }

    /**
     * Parse and verify if arguments passed in command line are correct commands.
     * This method fill in the parsedArg attribute.
     * If version or help are present, parse method will execute the function and stop the programme.
     * @param {String[]} [argv] list of command and argument of command inputted
     *
     * @throws {Error}
     *
     * @returns {Map} result
     *
     * @version 0.1.0
     */
    parse(argv = process.argv.slice(2)) {
        let currCmd = null;
        let values = [];
        const parsedArg = new Map();

        // STEP 1: Parse argv
        const writeCommand = () => {
            // replace shortcut by command name
            const key = this.shortcuts.has(currCmd) ? this.shortcuts.get(currCmd) : currCmd;

            const val = values.length === 1 ? values[0] : values;
            parsedArg.set(key, val);
            values = [];

            // if version or help are present execute the function and stop the programme
            if (key === "version") {
                console.log(`v${this.version}`);
                process.exit(1);
            }
            else if (key === "help") {
                this.help();
                process.exit(1);
            }
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

        // STEP 2: Check parsedArg
        const result = new Map();
        const E_TYPES = new Map([
            ["number", (val) => Number.isNaN(Number(val))],
            ["string", (val) => typeof val !== "string"],
            ["array", (val) => !Array.isArray(val)]
        ]);
        console.log(parsedArg);

        for (const [commandName, values] of parsedArg) {
            if (!this.commands.has(commandName)) {
                continue;
            }

            let { type, defaultVal } = this.commands.get(commandName);
            type = type.toLowerCase();

            if (E_TYPES.has(type) && E_TYPES.get(type)(values.length === 0 ? defaultVal : values)) {
                throw new TypeError(`Arguments of ${commandName} must be type of ${type}`);
            }

            if (values.length === 0) {
                result.set(commandName, is.nullOrUndefined(defaultVal) ? true : defaultVal);
            }
            else {
                result.set(commandName, values);
            }
        }

        return result;
    }

    /**
     * displays informations about the addon and all the arguments that the addon can take in the console
     * @param {String} [packageJson=null] Path to package.json
     * @function help
     * @return {void}
     * @version 0.1.0
    */
    help() {
        // read the package.json to get name of addon and his description & print it
        const buf = readFileSync(join(__dirname, "package.json"));
        const { name, description } = JSON.parse(buf.toString());

        console.log(`Usage: ${name} [option]\n\n${description}\n\noptions:`);
        for (const command of this.commands) {
            console.log(`\t-${command.shortcut}, --${command.name}`);
            console.log(`\t\t${command.description}`);
        }
    }
}

module.exports = ArgParser;

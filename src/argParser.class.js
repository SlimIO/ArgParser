// Require Node.JS dependencies
const { readFileSync } = require("fs");

// Require Third-party dependencies
const is = require("@slimio/is");

/**
 * @typedef {(Number|String|Boolean)} ArgValueType
 */

const E_TYPES = new Map([
    ["number", (val) => Number.isNaN(Number(val))],
    ["string", (val) => typeof val !== "string"],
    ["array", (val) => !Array.isArray(val)]
]);

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
     * @param {!String} packagePath Path to the package.json file
     *
     * @throws {Error}
     */
    constructor(version, packagePath) {
        if (is.nullOrUndefined(version)) {
            throw new Error("You must precise the version of argParse used");
        }
        if (is.nullOrUndefined(packagePath)) {
            throw new Error("You must precise the path of the package.json file");
        }

        this.commands = new Map();
        this.shortcuts = new Map([
            ["h", "help"],
            ["v", "version"]
        ]);
        this.version = version;
        this.packagePath = packagePath;
    }

    /**
     * @version 0.1.0
     *
     * @method addCommand
     * @desc Adds a command to the command list. All command that will not be in this list will be ignored.
     * @memberof ArgParser#
     *
     * @param {!String} name name of command
     * @param {Object=} options Object represent options for command line
     * @param {String=} options.description Description of what the argument provide
     * @param {String=} options.shortcut Shortcut of argument
     * @param {ArgValueType=} options.defaultVal Defalt value of the command
     * @param {String=} options.type Argument type of commands. Must be in lower case
     *
     * @returns {ArgParser}
     *
     * @throws {Error}
     * @throws {TypeError}
     */
    addCommand(name, options) {
        if (!is.string(name)) {
            throw new TypeError("name param must be a string");
        }
        if (!is.plainObject(options)) {
            throw new TypeError("options should be a plain JavaScript Object!");
        }

        if (!is.string(options.shortcut)) {
            throw new TypeError("options.shortcut param must be a string");
        }
        if (!is.string(options.type)) {
            throw new TypeError("options.type param must be a string");
        }
        if (!is.string(options.description)) {
            throw new TypeError("options.description param must be a string");
        }

        if (this.commands.has(name)) {
            throw new Error(`Duplicate command nammed "${name}"`);
        }

        // check duplicate shortcut
        if (this.shortcuts.has(options.shortcut)) {
            throw new Error(`Duplicate shortcut nammed "${options.shortcut}"`);
        }

        this.shortcuts.set(options.shortcut, name);
        this.commands.set(name, options);

        return this;
    }

    /**
     * @version 0.1.0
     *
     * @method parse
     * @desc Parse and verify if arguments passed in command line are correct commands.
     * This method return a Map with all authorized command with their arguments.
     * If version or help are present, parse method will execute the function and stop the programme.
     * @memberof ArgParser#
     * @param {String[]} [argv] list of command and argument of command inputted
     *
     * @returns {Map<String, (ArgValueType | ArgValueType[])>} result
     *
     * @throws {Error}
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
                this.help(this.packagePath);
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
        for (const [commandName, values] of parsedArg) {
            if (!this.commands.has(commandName)) {
                continue;
            }

            // eslint-disable-next-line
            let { type, defaultVal } = this.commands.get(commandName);
            type = !is.nullOrUndefined(type) ? type.toLowerCase() : null;

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
     * @version 0.1.0
     *
     * @method help
     * @desc displays informations about the addon and all the arguments that the addon can take in the console
     * @memberof ArgParser#
     * @param {!String} packageJson Path to package.json
     * @return {void}
     *
     * @throws {Error}
    */
    help(packageJson) {
        if (!is.string(packageJson)) {
            throw new Error("You must specify the path to the package");
        }

        // read the package.json to get name of addon and his description & print it
        const buf = readFileSync(packageJson);
        const { name, description } = JSON.parse(buf.toString());

        console.log(`Usage: ${name} [option]\n\n${description}\n\noptions:`);
        for (const command of this.commands) {
            console.log(`\t-${command.shortcut}, --${command.name}`);
            console.log(`\t\t${command.description}`);
        }
    }
}

module.exports = ArgParser;

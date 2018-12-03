// Require Node.js Dependencies
const { basename } = require("path");

/** @typedef {(Number|String|Boolean)} ArgValueType */

/**
 * @typedef {Object} Command
 * @property {String} type
 * @property {String} shortcut
 * @property {String} description
 * @property {*} defaultVal
 */

const E_TYPES = new Map([
    ["number", (val) => Number.isNaN(Number(val))],
    ["string", (val) => typeof val !== "string"],
    ["array", (val) => !Array.isArray(val)],
    ["boolean", (val) => typeof val !== "boolean"]
]);

// eslint-disable-next-line
const CMD_REG = /^(-{1}(?<shortcut>[a-z]){1})?\s?(-{2}(?<name>[a-z]+)){1}\s?(\[(?<type>number|string|array)(=(?<defaultVal>.*))?\])?$/;

/**
 * @version 0.1.0
 *
 * @class ArgParser
 * @classdesc Parse arguments in command line for SlimIO projects
 *
 * @property {Map} commands all commands accepted to be parsed. Commands are define by developper.
 * @property {Map} shortcuts all existing shortcut with name associated to avoid duplicating them.
 * @property {String} version Current version of ArgParser.
 * @property {String} description CLI Description
 */
class ArgParser {

    /**
     * @version 0.1.0
     *
     * @constructs ArgParser
     * @param {!String} version CLI Version
     * @param {String} [description] CLI Description
     *
     * @throws {TypeError}
     *
     * @example
     * const parser = new ArgParser("v1.0.0", "CLI Description");
     */
    constructor(version, description = "") {
        if (typeof version !== "string") {
            throw new TypeError("version must be a string");
        }
        if (typeof description !== "string") {
            throw new TypeError("description must be a string");
        }

        /** @type {Map<String, Command>} */
        this.commands = new Map();

        /** @type {Map<String, String>} */
        this.shortcuts = new Map([
            ["h", "help"],
            ["v", "version"]
        ]);
        this.version = version;
        this.description = description;
    }

    /**
     * @version 0.1.0
     *
     * @method addCommand
     * @desc Adds a command to the command list. All command that will not be in this list will be ignored.
     * @memberof ArgParser#
     * @param {!String} cmd name of command
     * @param {String} [description] command description
     * @returns {ArgParser}
     *
     * @throws {Error}
     * @throws {TypeError}
     *
     * @example
     * const parser = new ArgParser("v1.0.0")
     *     .addCommand("-p --product [number=10]", "product count")
     *     .addCommand("-c --colors [array]", "Array of colors")
     *     .addCommand("--verbose", "Enable verbose mode!");
     */
    addCommand(cmd, description = "") {
        if (typeof description !== "string") {
            throw new TypeError("description must be a string");
        }

        // Retrieve command options
        const result = CMD_REG.exec(cmd);
        if (result === null) {
            throw new Error("Unable to parse command");
        }
        const { shortcut, name, type = "boolean" } = result.groups;
        let defaultVal = result.groups.defaultVal;

        // Add and check shortcut
        if (typeof shortcut !== "undefined") {
            if (this.shortcuts.has(shortcut)) {
                throw new Error(`Duplicate shortcut nammed "${shortcut}"`);
            }

            this.shortcuts.set(shortcut, name);
        }

        if (type === "boolean" && typeof defaultVal === "undefined") {
            defaultVal = false;
        }
        else if (type === "number" && typeof defaultVal !== "undefined") {
            defaultVal = Number(defaultVal);
        }
        this.commands.set(name, { shortcut, type, description, defaultVal });

        return this;
    }

    /**
     * @version 0.1.0
     *
     * @method parse
     * @desc Parse and verify if arguments passed in command line are correct commands.
     * @memberof ArgParser#
     * @param {String[]} [argv] list of command and argument of command inputted
     * @returns {Map<String, (ArgValueType | ArgValueType[])>} result
     *
     * @throws {TypeError}
     * @throws {Error}
     *
     * @example
     * const { strictEqual } = require("assert");
     * const parser = new ArgParser("v1.0.0")
     *     .addCommand("-c --colors [array]", "Array of colors")
     *     .addCommand("--verbose", "Enable verbose mode!");
     *
     * const colors = ["red", "yellow"];
     * const result = parser.parse(["-c" , ...colors, "--verbose"]);
     * strictEqual(result.get("verbose"), true);
     * strictEqual(result.get("colors").toString(), colors.toString());
     */
    parse(argv = process.argv.slice(2)) {
        if (!Array.isArray(argv)) {
            throw new TypeError("argv must be an array");
        }

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
                console.log(this.version);
                process.exit(1);
            }
            else if (key === "help") {
                this.showHelp();
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

            const { type, defaultVal } = this.commands.get(commandName);
            const value = values.length === 0 ? defaultVal || true : values;

            if (E_TYPES.get(type)(value)) {
                throw new Error(`<${commandName}> CLI argument must be type of ${type}`);
            }
            result.set(commandName, value);
        }

        // STEP 3: Setup default commands values!
        for (const [name, cmd] of this.commands.entries()) {
            if (result.has(name) || typeof cmd.defaultVal === "undefined") {
                continue;
            }

            result.set(name, cmd.defaultVal);
        }

        return result;
    }

    /**
     * @version 0.1.0
     *
     * @method showHelp
     * @desc Displays informations about the addon and all the arguments that the addon can take in the console
     * @memberof ArgParser#
     * @return {void}
     *
     * @throws {Error}
    */
    showHelp() {
        console.log(`Usage: node ${basename(process.argv[1])} [option]`);
        console.log(`${this.description}\noptions:`);

        for (const [name, { shortcut, description }] of this.commands.entries()) {
            const isShortCutDefined = typeof shortcut !== "undefined";
            console.log(`\t${isShortCutDefined && `-${shortcut} ,`}--${name}`);
            console.log(`\t${description}\n`);
        }

        process.exit(0);
    }
}

module.exports = ArgParser;

// Require Node.JS dependencies
const {
    promises: { readFile, access },
    constants: { R_OK }
} = require("fs");
const { parse, join } = require("path");

// Require Third-party dependencies
const is = require("@slimio/is");

/** This callback is called `commandFctCallback` and execute the associated function of specifique command
 * @callback commandFctCallback
 */

/**
 * @class ArgParser
 * @classdesc Parse arguments in command line for SlimIO projects
 *
 * @property {Object[]} commands list of command define by developper
 * @property {Object} parsedArgs OBject represent parsed arguments command line
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
        this.commands = [];
        this.parsedArgs = {};
        this.version = version;
    }

    /**
     * add a command
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
        // check existance of duplicate name or shortcut
        if (this.commands.length > 0) {
            for (const command of this.commands) {
                if (command.name === name) {
                    const error = `The name ${name} already exist`;
                    throw new Error(error);
                }
                if (!is.nullOrUndefined(options.shortcut) && command.shortcut === options.shortcut) {
                    const error = `The shortcut ${command.shortcut} already exist`;
                    throw new Error(error);
                }
            }
        }
        options.name = name;
        this.commands.push(options);
    }

    /** Parse and verify if arguments passed in command line are executable
     * @param {String[]} [argv=process.argv.slice(2)] list of command entered
     * @throws {Error}
     *
     * @returns {Object|void} Object represent all arguments parsed
     *
     * @version 0.1.0
     */
    parse(argv = process.argv.slice(2)) {
        let currCmd = null;
        const commmandes = new Map();
        const shortcut = new Map();
        let values = [];
        
        function writeCommand() {            
            commmandes.set(currCmd, values.length === 0 ? true : values.length === 1 ? values[0] : values);
            values = [];
        }

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
        console.log(commmandes);

        return this.parsedArgs;
    }

    /** Execute fonctions associated to commands
     * @method execute
     * @param {Object} [parsedArgs = this.parsedArgs] Object represent parsed arguments command line
     * @throws {Error}
     *
     * @return {void}
     */
    execute() {
        // vérifier la validité des commandes contenu dans l'obj parsedArgs
        for (const key of Object.keys(this.parsedArgs)) {
            // console.log(`\n${key} - ${this.parsedArgs[key]}`);
            const atLeastOneTrue = [];
            let correctTypes = false;

            for (const command of this.commands) {
                // console.log(`${command.name} - ${typeof command.defaultVal}|${typeof this.parsedArgs[key]}`);
                const typeDefaultVal = typeof command.defaultVal;
                const typePasedArg = typeof this.parsedArgs[key];
                correctTypes = typeDefaultVal === typePasedArg;
                // Verify correct type of arguments comparing to the defaultVal
                console.log(`command.defaultVal: ${command.defaultVal}`);
                if (command.defaultVal && command.name === key && !correctTypes) {
                    const error = `${key}'s argument is a ${typeof this.parsedArgs[key]} and it should be a ${typeof command.defaultVal}`;
                    throw new Error(error);
                }
                // Verify if there is at least one command write on command line
                // which match with command added with addCommand method
                atLeastOneTrue.push(key === command.name);
            }
            if (!(key === "version" || key === "v" || key === "help" || key === "h")) {
                const isFinded = atLeastOneTrue.find((val) => val === true);
                if (!isFinded) {
                    const error = `commande "${key}" does not exist`;
                    throw new Error(error);
                }
            }
            // Execute callBack
            if (key === "version" || key === "v") {
                console.log(`v${this.version}`);
            }
            else if (key === "help" || key === "h") {
                this.help();
            }
            // if a command takes several arguments call() apply()
            else {
                this[key].call(this);
            }
        }
    }

    /** displays informations about the addon and all the arguments that the addon can take in the console
     * @param {String} [packageJson=null] Path to package.json
     * @function help
     * @return {Promise}
     * @version 0.1.0
    */
    async help() {
        const packageJson = join(parse(__dirname).dir, "package.json");        
        // read the package.json to get name of addon and his description & print it
        await access(packageJson, R_OK);
        const data = await readFile(packageJson, { encoding: "utf8" });
        const { name, description } = JSON.parse(data);
        console.log(`Usage: ${name} [option]\n\n${description}\n\noptions:`);
        // print every option on terminal
        for (const command of this.commands) {
            console.log(`\t-${command.shortcut}, --${command.name}\n\t\t${command.description}`);
        }
    }
}

module.exports = ArgParser;

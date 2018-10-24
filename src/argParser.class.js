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

/**
 * @class ArgParser
 * @classdesc Parse arguments in command line for SlimIO projects
 *
 * @property {String[]} args Arguments passed in command line
 * @property {Object[]} commands Command Object
 * @property {Object} parsedArgs OBject represent arguments passed in command line parsed
 * @property {String} packagePath Path to Package.json
 *
 * @version 0.1.0
 */
class ArgParser {
    /**
     * @constructs ArgParser
     */
    constructor() {
        this.args = process.argv.slice(2);
        this.commands = [];
        this.parsedArgs = {};
        const { dir } = parse(__dirname);
        this.packagePath = join(dir, "package.json");
    }

    /**
     * add commands with a name, shortcut [description] that will be used as comparisons with the arguments inserted in the command line
     * the name of the argument must match with the name of the associated function
     * @param {String} shortcut shortcut of argument
     * @param {String} name name of argument must
     * @param {String} description description of what the argument provide
     * @returns {void}
     * @throws {TypeError}
     */
    addCommand(shortcut, name, description) {
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
        this.commands.push({ shortcut, name, description });
    }

    /** Parse and verify if arguments passed in command line are executable
     * @returns {Object} Object represent all arguments parsed
     * @throws {Error}
     */
    parse() {
        const parsedArgs = Object.create(null);
        let currentCmd;
        let values = [];
        let value = null;
        let prevArgCommand = false;
        // parser les arguments en ligne de commande et les confrontés avec la liste des commandes définies
        if (this.args.length === 0) {
            return;
        }
        if (this.commands.length === 0) {
            throw new Error("There is no commands, you have to add option with addCommands() method befor using parse() methode");
        }

        for (const argvArgument of this.args) {
            // Si l'argument commence par deux tiret on push la valeur dans l'array
            // properties afain de créer le futur objet this.parsedArgs
            if (/^-{2}/g.test(argvArgument)) {
                // Remise a zero des variables values et values lorsqu'on tombe sur une commande "--"
                // Mise en mémoire de la nouvelle commande rencontrée
                value = null;
                values = [];
                if (!prevArgCommand) {
                    currentCmd = argvArgument.slice(2);
                    prevArgCommand = true;
                }
                else {
                    Reflect.set(parsedArgs, argvArgument.slice(2), true);
                }
                
            }
            // else if si on trouve un alias + aller chercher a quel nom de commande correspond l'alias
            else {
                // On rentre ici uniquement si la valeur de argvArgument ne possède pas de tirets
                // On traite donc ici les arguments des commandes
                // il faut donc spécifié pour la prochaine itération que l'argument précedent n'est pas une commande
                prevArgCommand = false;
                // for the first argument of a command
                if (value === null) {
                    value = argvArgument;
                    values.push(value);
                    Reflect.set(parsedArgs, currentCmd, value);
                }
                else {
                    // if there is severals argument for one command
                    values.push(value);
                    Reflect.set(parsedArgs, currentCmd, values);
                }
            }
        }

        return parsedArgs;
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

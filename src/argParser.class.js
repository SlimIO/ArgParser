// Require Node.JS dependencies
const {
    promises: { readFile, access },
    constants: { R_OK }
} = require("fs");
const { parse, join } = require("path");

// Require Third-party dependencies
const is = require("@slimio/is");

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
     * add commands
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
        let currentCmd;
        let values = [];
        let value = null;
        let prevArgCommand = false;
        // parser les arguments en ligne de commande et les confrontés avec la liste des commandes définies
        if (argv.length === 0) {
            return void 0;
        }
        if (this.commands.length === 0) {
            throw new Error("There is no commands, you have to add option with addCommands() method befor using parse() methode");
        }
        for (const argvArgument of argv) {
            // Si l'argument commence par deux tiret on push la valeur dans l'array
            // properties afain de créer le futur objet this.parsedArgs
            if (/^-{2}/g.test(argvArgument) || /^-{1}/g.test(argvArgument)) {
                // Remise a zero des variables values et values lorsqu'on tombe sur une commande "--"
                // Mise en mémoire de la nouvelle commande rencontrée
                value = null;
                values = [];
                // si l'argument precedent ne fut pas une commande
                // ce qui signifie que la commande ne possedais pas d'arguments, on la passe donc a true
                if (!prevArgCommand) {
                    currentCmd = /^-{2}/g.test(argvArgument) ? argvArgument.slice(2) : argvArgument.slice(1);
                    prevArgCommand = true;
                }
                else { 
                    Reflect.set(this.parsedArgs, argvArgument.slice(2), true);
                }
            }
            else {
                // On rentre ici uniquement si la valeur de argvArgument ne possède pas de tirets
                // On traite donc ici les arguments des commandes
                // il faut donc spécifié pour la prochaine itération que l'argument précedent n'est pas une commande
                prevArgCommand = false;
                // for the first argument of a command
                if (value === null) {
                    value = argvArgument;
                    values.push(value);
                    Reflect.set(this.parsedArgs, currentCmd, value);
                }
                else {
                    // if there is severals argument for one command
                    values.push(argvArgument);
                    Reflect.set(this.parsedArgs, currentCmd, values);
                }
            }
        }

        return this.parsedArgs;
    }

    /** Execute fonctions associated to commands
     * @method execute
     * @param {Object} [parsedArgs = this.parsedArgs] OBject represent parsed arguments command line
     * @throws {Error}
     *
     * @return {void}
     */
    execute() {
        // vérifier si la validité des commandes contenu dans l'obj parsed arg
        for (const key of Object.keys(this.parsedArgs)) {
            console.log(`${key} - ${this.parsedArgs[key]}`);
            let isEqual = false;
            for (const command of this.commands) {
                console.log(`\tcommand : ${command.name}`);
                if (key === command.name) isEqual = true;
            }
            if (!isEqual) {
                const error = `Command "${key}" not found`;
                throw Error(error);
            }
        }
        
        // vérifier le type des arguments des commandes (defaltVal)
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

        let maxLengthName = 0;
        // browse table to get max lenth of name option to deduce number of white space
        for (const command of this.commands) {
            if (maxLengthName < command.name.length) {
                maxLengthName = command.name.length;
            }
        }
        // print every option on terminal
        for (const command of this.commands) {
            const whiteSpace = " ".repeat(maxLengthName - command.name.length);
            console.log(`\t-${command.shortcut}, --${command.name} ${whiteSpace} ${command.description}`);
        }
    }

    /** Give the actual version of the addon
     * @returns {void}
     * @version 0.1.0
     */
    getVersion() {
        console.log(`v${this.version}`);
    }
}

module.exports = ArgParser;

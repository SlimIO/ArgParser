/**
 * @namespace ArgParser
 */

/** @typedef {(Number|String|Boolean)} ArgValueType */

/**
 * @typedef {Object} Command
 * @property {String} name
 * @property {String} type
 * @property {String} shortcut
 * @property {String} description
 * @property {*} defaultVal
 */

// eslint-disable-next-line
const CMD_REG = /^(-{1}(?<shortcut>[a-z]){1})?\s?(-{2}(?<name>[a-z]+)){1}\s?(\[(?<type>number|string|array)(=(?<defaultVal>.*))?\])?$/;
const TYPES = {
    string: (value) => typeof value !== "string",
    number: (value) => Number.isNaN(Number(value)),
    boolean: (value) => typeof value !== "boolean",
    array: (value) => !Array.isArray(value)
};

/**
 * @version 0.2.0
 *
 * @method argDefinition
 * @desc Adds a command to the command list. All command that will not be in this list will be ignored.
 * @memberof ArgParser#
 * @param {!String} cmd name of command
 * @param {String} [description] command description
 * @returns {Command}
 *
 * @throws {Error}
 */
function argDefinition(cmd, description = "") {
    const result = CMD_REG.exec(cmd);
    if (result === null) {
        throw new Error("Unable to parse command");
    }

    const { shortcut, name, type = "boolean" } = result.groups;
    let defaultVal = result.groups.defaultVal;

    if (type === "boolean" && typeof defaultVal === "undefined") {
        defaultVal = true;
    }
    else if (type === "number" && typeof defaultVal !== "undefined") {
        defaultVal = Number(defaultVal);
    }

    return { name, shortcut, type, description, defaultVal };
}

/**
 * @version 0.2.0
 *
 * @method parseArg
 * @desc Parse and verify if arguments passed in command line are correct commands.
 * @memberof ArgParser#
 * @param {Command[]} [argDefinitions] arguments definitions
 * @param {String[]} [argv] list of command and argument of command inputted
 * @returns {Map<String, (ArgValueType | ArgValueType[])>} result
 *
 * @throws {TypeError}
 * @throws {Error}
 */
function parseArg(argDefinitions = [], argv = process.argv.slice(2)) {
    if (!Array.isArray(argv)) {
        throw new TypeError("argv must be an array");
    }

    const shortcuts = new Map(argDefinitions.map((cmd) => [cmd.shortcut, cmd.name]));
    const parsedArg = new Map();
    let currCmd = null;
    let values = [];

    for (const arg of argv) {
        if (/^-{1,2}/.test(arg)) {
            if (currCmd !== null) {
                parsedArg.set(shortcuts.has(currCmd) ? shortcuts.get(currCmd) : currCmd,
                    values.length === 1 ? values[0] : values);
                values = [];
            }
            currCmd = arg.replace(/-/g, "");
        }
        else {
            values.push(arg);
        }
    }
    parsedArg.set(shortcuts.has(currCmd) ? shortcuts.get(currCmd) : currCmd, values.length === 1 ? values[0] : values);

    const result = new Map();
    for (let id = 0; id < argDefinitions.length; id++) {
        const { name, type, defaultVal } = argDefinitions[id];

        if (parsedArg.has(name)) {
            let currValue = parsedArg.get(name);
            if (currValue.length === 0) {
                currValue = typeof defaultVal === "undefined" ? true : defaultVal;
            }

            if (TYPES[type](currValue)) {
                throw new Error(`<${name}> CLI argument must be type of ${type}`);
            }
            result.set(name, type === "number" ? Number(currValue) : currValue);
        }
        else {
            if (typeof defaultVal === "undefined") {
                continue;
            }
            result.set(name, type === "boolean" ? false : defaultVal);
        }
    }

    return result;
}

module.exports = { argDefinition, parseArg };

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
    // Retrieve command options
    const result = CMD_REG.exec(cmd);
    if (result === null) {
        throw new Error("Unable to parse command");
    }
    const { shortcut, name, type = "boolean" } = result.groups;
    let defaultVal = result.groups.defaultVal;

    if (type === "boolean" && typeof defaultVal === "undefined") {
        defaultVal = false;
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

    // Hydrate commands and shortcuts
    const commands = new Map();
    const shortcuts = new Map();
    const parsedArg = new Map();
    for (const def of argDefinitions) {
        commands.set(def.name, def);
        if (typeof def.shortcut === "string") {
            shortcuts.set(def.shortcut, def.name);
        }
    }

    const E_TYPES = new Map([
        ["number", (val) => Number.isNaN(Number(val))],
        ["string", (val) => typeof val !== "string"],
        ["array", (val) => !Array.isArray(val)],
        ["boolean", (val) => typeof val !== "boolean"]
    ]);
    let currCmd = null;
    let values = [];

    // STEP 1: Parse argv
    function writeCommand() {
        parsedArg.set(shortcuts.has(currCmd) ? shortcuts.get(currCmd) : currCmd,
            values.length === 1 ? values[0] : values);
        values = [];
    }

    for (const arg of argv) {
        if (/^-{1,2}/g.test(arg)) {
            currCmd !== null && writeCommand();
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
        if (!commands.has(commandName)) {
            continue;
        }

        const { type, defaultVal } = commands.get(commandName);
        const value = values.length === 0 ? defaultVal || true : values;

        if (E_TYPES.get(type)(value)) {
            throw new Error(`<${commandName}> CLI argument must be type of ${type}`);
        }
        result.set(commandName, value);
    }

    // STEP 3: Setup default commands values!
    for (const [name, cmd] of commands.entries()) {
        if (result.has(name) || typeof cmd.defaultVal === "undefined") {
            continue;
        }

        result.set(name, cmd.defaultVal);
    }

    return result;
}

module.exports = {
    argDefinition,
    parseArg
};

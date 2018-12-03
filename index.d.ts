/// <reference types="node" />

declare class ArgParser {
    constructor(version: string, description?: string);

    public version: string;
    public description: string;
    public commands: Map<string, ArgParser.Command>;
    public shortcuts: Map<string, string>;

    addCommand(cmd: string, description?: string): ArgParser;
    parse(argv?: string[]): Map<string, any>;
    showHelp(): void;
}

declare namespace ArgParser {
    type valueType = number | string | boolean | any[];

    interface Command {
        type: string;
        description: string;
        shortcut?: string;
        defaultVal?: valueType;
    }
}

export as namespace ArgParser;
export = ArgParser;

/// <reference types="node" />

declare namespace ArgParser {
    interface Command {
        name: string;
        type: string;
        description: string;
        shortcut?: string;
        defaultVal?: number | string | boolean | any[];
    }

    export function argDefinition(cmd: string, description?: string): Command;
    export function parseArg(argDefinitions?: Command[], argv?: string[]): Map<string, any>;
}

export as namespace ArgParser;
export = ArgParser;

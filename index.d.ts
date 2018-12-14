/// <reference types="node" />

declare namespace ArgParser {
    interface Command {
        name: string;
        type: string;
        description: string;
        shortcut?: string;
        defaultVal?: number | string | boolean | any[];
    }
    export type ArgvResult<T> = Map<keyof T, T[keyof T]>;

    export function argDefinition(cmd: string, description?: string): Command;
    export function parseArg<T>(argDefinitions?: Command[], argv?: string[]): ArgvResult<T>;
}

export as namespace ArgParser;
export = ArgParser;

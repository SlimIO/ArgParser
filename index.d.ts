/// <reference types="node" />

declare namespace ArgParser {
    export interface Command {
        name: string;
        type: string;
        description?: string;
        shortcut?: string;
        defaultVal?: number | string | boolean | any[];
    }

    export type ArgvResult<T> = Map<keyof T, T[keyof T]>;

    export function argDefinition(cmd: string, description?: string): ArgParser.Command;
    export function parseArg<T>(argDefinitions?: ArgParser.Command[], argv?: string[]): ArgParser.ArgvResult<T>;
    export function help(argDefinitions?: ArgParser.Command[]): void;
}

export as namespace ArgParser;
export = ArgParser;

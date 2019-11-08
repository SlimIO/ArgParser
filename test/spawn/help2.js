import * as ArgParser from "../../index.js";

const cmdDef = [
    ArgParser.argDefinition("-p --product [number=10]", "Product number description"),
    ArgParser.argDefinition("-t --truc [string]"),
    ArgParser.argDefinition("--bidule"),
    ArgParser.argDefinition("--chouette [boolean=false]")
];

ArgParser.help(cmdDef);

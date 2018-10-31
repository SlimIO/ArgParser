const is = require("@slimio/is");
/*
let xArray = [50, 10];
xArray = [];
if (xArray.length === 0) {
    throw new Error("xArray est vide");
}
for (const value of xArray) {
    console.log(`value : ${value}`);
}
-----------------------------------------------------------------------------
// let tabl = ["--version", 10, "--silent", ];
let value = false;
for (let index = 0; index < 5; index++) {
    console.log(`value : ${value}`);
    value = !value;
}
-----------------------------------------------------------------------------
const obj = Object.create(null);
const arr = [10, 20];

obj.test = arr;

console.log(obj);

const obj = { version: "10", hello: true, silent: "hello", "-s": "special" };

for (const key of Object.keys(obj)) { 
    console.log(`${key} - ${obj[key]}`);
}
-----------------------------------------------------------------------------
const arr = [false, false, false, false];
const y = arr.find((val) => val === true);

// const y = arr.reduce((prev, curr) => {
    //     if (prev === curr) return true;
    // }, false);
    // const y = arr.map((x) => x === true );
    console.log(y);
    if (y) {
        console.log("Il y a au moins une valeur a true");
    }else{
        console.log("Il n'y a aucune valeur a true");
    }
-----------------------------------------------------------------------------
const numberStr = "10";
const trueString = "truString";
console.log(Number("10"));
const isNumber = isNaN(Number("10"));
console.log(isNumber);
-----------------------------------------------------------------------------
const arr = [1, 2, 3, 4];
const arr1 = [6, 7];
arr.push(arr1);
console.log(arr);
-----------------------------------------------------------------------------
*/
const ret = new Map();
let currCmd = null;
let values = [];

const writeArguments = (x) => {
    
    currCmd = null;
}

for (const arg of process.argv.slice(2)) {
    if (/^-{1,2}/.test(arg)) {
        if (currCmd !== null) {
            writeArguments(arg);
        }
        currCmd = arg.replace(/-/g, "");

    }
    else {
        values.push(arg);
    }
}
console.log(values);
/*
-----------------------------------------------------------------------------
const currCmd = "--version";
if (currCmd) {
    console.log("not nll");
}
else {
    console.log("null");
}
*/

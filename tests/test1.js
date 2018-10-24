/*
let xArray = [50, 10];
xArray = [];
if (xArray.length === 0) {
    throw new Error("xArray est vide");
}
for (const value of xArray) {
    console.log(`value : ${value}`);
}

// let tabl = ["--version", 10, "--silent", ];
let value = false;
for (let index = 0; index < 5; index++) {
    console.log(`value : ${value}`);
    value = !value;
}
*/
/*
const obj = Object.create(null);
const arr = [10, 20];

obj.test = arr;

console.log(obj);
*/

const obj = { test: 10};
const arr = [10, 20];
Reflect.set(obj, "test", arr);
console.log(obj);

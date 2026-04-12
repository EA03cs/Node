
// const EventEmitter = require('events');
// const event = new EventEmitter();
// event.on('sayed', () => {
//     console.log('sayed event is emitted');
// });
// event.emit('sayed');
// event.emit('sayed');
// event.emit('sayed');
// event.emit('sayed');
// event.emit('sayed');
// event.off('sayed', () => {
//     console.log('sayed event is emitted');
// });
// event.emit('sayed');

// const fs = require('fs');

// const data = fs.readFileSync('file.txt', 'utf8');
// console.log(data);

// fs.readFile('file.txt', 'utf8', (err, data) => {
//     if (err) {
//         console.log('في مشكلة:', err);
//         return;
//     }
//     console.log(data);
// });

// // Sync
// fs.writeFileSync('output.txt', 'مرحبا يا عالم!', 'utf8');
// console.log('تم!');

// // Async
// fs.writeFile('output.txt', 'مرحبا يا عالم!', 'utf8', (err) => {
//     if (err) throw err;
//     console.log('اتحفظ!');
// });

// fs.unlinkSync('file.txt');           // Sync
// fs.unlink('file.txt', (err) => {}); // Async

// fs.mkdirSync('myFolder');            // Sync
// fs.mkdir('myFolder', (err) => {});  // Async

// fs.existsSync('myFolder'); // true أو false

// const fs = require('fs/promises');

// // بدل Callback بنستخدم async/await
// async function readMyFile() {
//     try {
//         const data = await fs.readFile('file.txt', 'utf8');
//         console.log(data);

//         await fs.writeFile('output.txt', 'بيانات جديدة');
//         console.log('اتكتب!');
//     } catch (err) {
//         console.log('في مشكلة:', err);
//     }
// }

// readMyFile();

// const fs = require('fs');
// const path = require('path');
// const filePath = path.resolve('./file.txt');
// const data = fs.readFileSync(filePath, 'utf8');
// console.log(data);
// const readStream = fs.createReadStream('file.txt', {
//     encoding: 'utf8',
//     highWaterMark: 64 * 1024 // حجم كل chunk = 64KB
// });

// readStream.on('data', (chunk) => {
//     console.log('جه chunk:', chunk.length, 'byte');
// });

// readStream.on('end', () => {
//     console.log('خلص الملف!');
// });

// readStream.on('pause', (err) => {
//     console.log('مشكلة:', err);
// });

// ===============================
// JavaScript Assignment Solution
// ===============================


// Problem 1: Type Conversion
let result = Number("123") + 7;
console.log(result); // 130


// Problem 2: Ternary Operator
let value = 0;
console.log(value ? value : "Invalid");


// Problem 3: Loop with Continue
for (let i = 1; i <= 10; i++) {
  if (i % 2 === 0) continue;
  console.log(i);
}


// Problem 4: Filter Even Numbers
let arr = [1, 2, 3, 4, 5];
let even = arr.filter(num => num % 2 === 0);
console.log(even);


// Problem 5: Merge Arrays
let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];
let merged = [...arr1, ...arr2];
console.log(merged);


// Problem 6: Switch Case Days
function getDay(num) {
  switch(num) {
    case 1: return "Sunday";
    case 2: return "Monday";
    case 3: return "Tuesday";
    case 4: return "Wednesday";
    case 5: return "Thursday";
    case 6: return "Friday";
    case 7: return "Saturday";
    default: return "Invalid";
  }
}


// Problem 7: Map Lengths
let words = ["a", "ab", "abc"];
let lengths = words.map(w => w.length);
console.log(lengths);


// Problem 8: Divisibility Check
function check(num) {
  return (num % 3 === 0 && num % 5 === 0)
    ? "Divisible by both"
    : "Not divisible";
}


// Problem 9: Arrow Function Square
const square = num => num * num;
console.log(square(5));


// Problem 10: Object Destructuring
function formatPerson({ name, age }) {
  return `${name} is ${age} years old`;
}

console.log(formatPerson({ name: "John", age: 30 }));


// Problem 11: Rest Parameters Sum
function sum(...nums) {
  return nums.reduce((acc, n) => acc + n, 0);
}
console.log(sum(1, 2, 3)); // 6


// Problem 12: Promise Async Task
function asyncTask() {
  return new Promise(resolve => {
    setTimeout(() => resolve("Success"), 3000);
  });
}
console.log("Task started");
asyncTask().then(result => console.log(result));


// Problem 13: Find Largest
function findLargest(arr) {
  return Math.max(...arr);
}

console.log(findLargest([1, 2, 3, 4, 5]));


// Problem 14: Object Keys
function getKeys(obj) {
  return Object.keys(obj);
}
console.log(getKeys({ a: 1, b: 2, c: 3 }));


// Problem 15: Split String
function splitWords(str) {
  return str.split(" ");
}

console.log(splitWords("Hello World"));



// ===============================
// Part B (Essay)
// ===============================


// Essay 1: forEach vs for...of
// forEach: array method, cannot use break or continue
// for...of: loop, supports break and continue


// Essay 2: Hoisting and TDZ
// Hoisting: variables/functions are moved to top before execution
// TDZ: using let/const before declaration causes error


// Essay 3: == vs ===
console.log("5" == 5);   // true
console.log("5" === 5);  // false


// Essay 4: try...catch
try {
  JSON.parse("wrong");
} catch (e) {
  console.log("Error handled");
}


// Essay 5: Conversion vs Coercion
let explicit = Number("123"); // Conversion
let implicit = "5" * 2;       // Coercion
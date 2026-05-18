const greet = (name) => `Hello, ${name}! Welcome to TypeScript.`;
const add = (a, b) => a + b;
const result = add(5, 7);
console.log(greet("Developer"));
console.log(`5 + 7 = ${result}`);
export { greet, add };

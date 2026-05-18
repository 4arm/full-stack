const greet = (name: string): string => `Hello, ${name}! Welcome to TypeScript.`;

const add = (a: number, b: number): number => a + b;

const result = add(5, 7);

console.log(greet("Developer"));
console.log(`5 + 7 = ${result}`);

export { greet, add };
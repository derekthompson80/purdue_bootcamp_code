function multiply(a,b){
    return a*b
}
console.log(multiply(2,3))
console.log(multiply(3,4))

function ispositive(a){
    return a > 0;

}
console.log(ispositive(-3))
console.log(ispositive(10))

// 3. **countEvenNumbers(maxNumber)**: A function that counts how many even numbers exist from 1 to maxNumber and returns the count.
//
function countEvenNumbers(maxNumber) {
    let count = 0;
    for (let i = 1; i <= maxNumber; i++) {
        if (i % 2 === 0) {
            count++;
        }
    }
    return count;
}

console.log(countEvenNumbers(25));



// 4. **repeatMessage(message, times)**: A function that prints a message a specified number of times using a for loop.

function repeatMessage(message, times) {
    for (let i = 0; i < times; i++) {
        console.log(message);
    }
}

repeatMessage("Hello, world!", 5);
//
// 5. **findSmaller(num1, num2)**: A function that returns the smaller of two numbers.

function findSmaller(num1, num2) {
    return Math.min(num1, num2);
}
console.log(findSmaller(10, 5));
//
// ### Challenge Exercise
//
// Once you've completed the basic exercises, try this slightly more challenging one:
//
// **calculateSquares(maxNumber)**: Write a function that prints the square of every number from 1 to maxNumber.

function calculateSquares(maxNumber) {
    for (let i = 1; i <= maxNumber; i++) {
        const squared = i * i;
        console.log(`${i} squared is ${squared}`);
    }
}
calculateSquares(4);
//
// Example output for `calculateSquares(4)`:
// ```
// 1 squared is 1
// 2 squared is 4
// 3 squared is 9
// 4 squared is 16
// ```
//
// ### Tips for Success
//
// - Start with one function at a time
// - Test each function with different numbers to make sure it works
// - Use `console.log()` to see what your function is doing
// - Don't worry about making mistakes - that's how you learn!
// - If you get stuck, review the examples above
//
// ## Additional Practice Exercises
//
// 1. **Weather Advisor**: Write a function that takes a temperature and returns clothing advice ("wear a coat", "wear a t-shirt", etc.)
//
// 2. **Counting Even Numbers**: Write a loop that counts and displays all even numbers from 1 to 20.
//
// 3. **Password Checker**: Write a function that checks if a password is at least 8 characters long and returns true or false.
//
// 4. **Multiplication Table**: Create a function that prints the multiplication table for a given number using a loop.
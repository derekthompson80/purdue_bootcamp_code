// # JavaScript Fundamentals for Beginners
//
// ## Lesson Overview
// This lesson covers five essential JavaScript concepts:
// 1. Arrays
// 2. Objects
// 3. Strings and Their Methods
// 4. Understanding Scope
// 5. Basic DOM Manipulation
//
// ## 1. Arrays
//
// Arrays are ordered collections of data that allow you to store multiple values in a single variable.
//
// ### Creating Arrays
//
// ```javascript
// let fruits = ["apple", "banana", "cherry"];
// console.log(fruits);
// ```
//
// ### Accessing Array Elements
//
// ```javascript
// let firstFruit = fruits[0];
// console.log("First fruit:", firstFruit);
// ```
//
// ### Modifying Arrays
//
// ```javascript
// fruits.push("date");
// console.log("After adding date:", fruits);
//
// fruits[1] = "blueberry";
// console.log("After changing banana to blueberry:", fruits);
// ```
//
// ### Looping Through Arrays
//
// ```javascript
// for (let i = 0; i < fruits.length; i++) {
//   console.log("Fruit at index", i, "is", fruits[i]);
// }
// ```
//
// ### Array Methods
//
// ```javascript
// let numbers = [1, 2, 3, 4, 5];
// console.log("Original numbers:", numbers);
//
// let doubled = numbers.map(function(num) {
//   return num * 2;
// });
// console.log("Doubled numbers:", doubled);
//
// let evenNumbers = numbers.filter(function(num) {
//   return num % 2 === 0;
// });
// console.log("Even numbers:", evenNumbers);
//
// let sum = numbers.reduce(function(total, num) {
//   return total + num;
// }, 0);
// console.log("Sum of numbers:", sum);
// ```
//
// ### Nested Arrays
//
// ```javascript
// let matrix = [
//   [1, 2, 3],
//   [4, 5, 6],
//   [7, 8, 9]
// ];
// console.log("Matrix:", matrix);
//
// for (let i = 0; i < matrix.length; i++) {
//   for (let j = 0; j < matrix[i].length; j++) {
//     console.log("Element at [", i, "][", j, "] is", matrix[i][j]);
//   }
// }
// ```
//
// ## 2. Objects
//
// Objects are collections of key-value pairs that allow you to store related data and functions together.
//
// ### Creating Objects
//
// ```javascript
// let person = {
//   name: "Alice",
//   age: 25,
//   greet: function() {
//     console.log("Hello, my name is " + this.name);
//   }
// };
// console.log(person);
// ```
//
// ### Accessing Object Properties
//
// ```javascript
// console.log("Name:", person.name);
// console.log("Age:", person.age);
// ```
//
// ### Modifying Objects
//
// ```javascript
// person.age = 26;
// console.log("After birthday, age:", person.age);
//
// person.city = "New York";
// console.log("After adding city:", person);
// ```
//
// ### Calling Object Methods
//
// ```javascript
// person.greet();
// ```
//
// ## 3. Strings and Their Methods
//
// Strings are sequences of characters used to represent text.
//
// ### Creating Strings
//
// ```javascript
// let greeting = "Hello, world!";
// console.log(greeting);
// ```
//
// ### String Methods
//
// ```javascript
// console.log("Length of greeting:", greeting.length);
// console.log("Uppercase greeting:", greeting.toUpperCase());
// console.log("Substring of greeting:", greeting.substring(0, 5));
// console.log("Replace 'world' with 'JavaScript':", greeting.replace("world", "JavaScript"));
// console.log("Split greeting into words:", greeting.split(" "));
// ```
//
// ## 4. Understanding Scope
//
// Scope determines the visibility of variables and functions in different parts of your code.
//
// ### Global Scope
//
// ```javascript
// let globalVar = "I am global";
//
// function showGlobalVar() {
//   console.log(globalVar);
// }
//
// showGlobalVar();
// ```
//
// ### Local Scope
//
// ```javascript
// function showLocalVar() {
//   let localVar = "I am local";
//   console.log(localVar);
// }
//
// showLocalVar();
// // console.log(localVar); // This will cause an error because localVar is not accessible here
// ```
//
// ### Block Scope
//
// ```javascript
// if (true) {
//   let blockVar = "I am block-scoped";
//   console.log(blockVar);
// }
// // console.log(blockVar); // This will cause an error because blockVar is not accessible here
// ```
//
// ## 5. Basic DOM Manipulation
//
// The Document Object Model (DOM) represents the structure of a web page. You can use JavaScript to interact with and manipulate the DOM.
//
// ### Selecting Elements
//
// ```javascript
// let heading = document.querySelector("h1");
// console.log(heading);
// ```
//
// ### Modifying Elements
//
// ```javascript
// heading.textContent = "New Heading";
// console.log("Updated heading:", heading.textContent);
// ```
//
// ### Adding Elements
//
// ```javascript
// let newParagraph = document.createElement("p");
// newParagraph.textContent = "This is a new paragraph.";
// document.body.appendChild(newParagraph);
// ```
//
// ### Removing Elements
//
// ```javascript
// let oldParagraph = document.querySelector("p");
// document.body.removeChild(oldParagraph);
// ```
//
// ### Array Exercises
//
// #### Exercise 1: Shopping List Manager
//
// Create a program that manages a shopping list with the following features:
// - Add items to the list
let shoppingList = [];
function addItem(item) {
    shoppingList.push(item);
}
addItem("Milk");
addItem("Eggs");
addItem("Bread");
addItem("Cheese");
console.log(shoppingList);

// - Remove items from the list
function removeItem(item) {
    const index = shoppingList.indexOf(item);
    if (index !== -1) {
        shoppingList.splice(index, 1);
    } else {
        console.log("Item not found in the list.");
    }
}
removeItem("Eggs");

// - Display all items in the list
function displayShoppingList() {
    console.log(shoppingList);
}
displayShoppingList();

// - Check if an item is in the list
function checkItem(item) {
    let foundItem = shoppingList.includes(item);
    if (foundItem) {
        console.log(`${item} is in the list.`);
    } else {
        console.log(`${item} is not in the list.`);
    }

}

checkItem("Milk");

//
// ### Object Exercises
//
// #### Exercise 1: Car Inventory
//
// Create a program to manage a car inventory:
// - Add new cars to the inventory. Each car should have properties like `make`, `model`, `year`, and `price`.
function Cars(make, model, year, price) {
    this.make = make;
    this.model = model;
    this.year = year;
    this.price = price;
}
let car1 = new Cars("Toyota", "Camry", 2020, 100000);
let car2 = new Cars("Honda", "Civic", 2018, 80000);
let car3 = new Cars("Ford", "Focus", 2016, 70000);

const inventory = [car1, car2, car3];

// - Display all cars in the inventory.
function displayInventory(car_List) {
    car_List.forEach(car => {console.log(`Make: ${car.make}, Model: ${car.model}, Year: ${car.year}, Price: ${car.price}`);})
}

// - Update the details of a car in the inventory.
function updateCar(make, newDetails) {
    let searchCar = searchCars(make);
    if (searchCar) {
        searchCar.year = newDetails;
        console.log(`Updated car: ${searchCar.make}, Year: ${searchCar.year}`);
    } else {
        console.log("Car not found in the inventory.");
    }
}

// - Search for cars based on specific criteria (e.g., `make` or `year`).
function searchCars(make) {
    return inventory.find(car => car.make === make) || null;
}

function removeInventory(make) {
    let searchCar = searchCars(make);
    if (searchCar) {
        console.log(`Removed car: ${searchCar.make}, Year: ${searchCar.year}`);
        let newInventory = inventory.filter(car => car.make !== make);
        return displayInventory(newInventory);

    }
    else {
        console.log("Car not found in the inventory.");
    }
}

displayInventory(inventory);
// - Remove car from the inventory by a unique identifier (example: remove by model).
removeInventory("Honda");
// - Display the details of a specific car in the inventory.
console.log(searchCars("Honda"));
// - Update the details of a specific car in the inventory.

updateCar("Toyota", 2021);
displayInventory(inventory);  
// ## Next Steps
// - Once you're comfortable with these concepts, you can move on to:
// - Arrays and Objects
// - Working with the DOM (Document Object Model)
// - Event handling
// - Modern JavaScript features (arrow functions, template literals, etc.)
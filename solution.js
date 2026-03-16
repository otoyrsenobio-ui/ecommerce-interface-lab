 // ------------------- Problem 1 ------------------//
 function checkVariable(input) {
     switch (typeof input) {
         case 'string':
             return 'string';
         case 'number':
             return 'number';
         case 'boolean':
             return 'boolean';
         case 'bigint':
             return 'bigint';
         case 'undefined':
             return 'undefined';
         case 'object':
             return 'object';
         default:
             return 'object';
     }
 }
 // ------------------- Problem 2 ------------------//
 function generateIDs(count) {
     var ids = [];
     for (var i = 0; i < count; i++) {
         if (i === 5) continue;
         ids.push('ID-' + i);
     }
     return ids;
 }
 // ------------------- Problem 3 ------------------//
 function calculateTotal() {
     var numbers = Array.prototype.slice.call(arguments);
     for (var i = 0; i < numbers.length; i++) {
         if (typeof numbers[i] !== 'number') {
             throw new TypeError('Invalid input: All arguments must be numbers');
         }
     }
     return numbers.reduce(function(acc, val) {
         return acc + val;
     }, 0);
 }
 // ------------------- Problem 4 ------------------//
 function getTopScorers(playerList) {
     return playerList
         .filter(function(player) {
             return player.score > 8;
         })
         .map(function(player) {
             return player.name;
         })
         .join(', ');
 }
 // ------------------- Problem 5 ------------------//
 class Item {
     constructor(name, price) {
         this.name = name;
         this.price = price;
         this.discount = 0.1;
     }

     get finalPrice() {
         return this.price - (this.price * this.discount);
     }
 }
 // ------------------- Problem 6 ------------------//
 function safeDivide(a, b) {
     try {
         if (b === 0) throw new Error('Cannot divide by zero');
         return a / b;
     } catch (error) {
         return error.message;
     } finally {
         console.log('Operation attempted');
     }
 }

 // ------------------- Tests -------------------
 console.log(checkVariable("hello"));
 console.log(generateIDs(7));
 console.log(calculateTotal(1, 2, 3, 4));

 var players = [
     { name: "Alice", score: 10 },
     { name: "Bob", score: 5 },
     { name: "Charlie", score: 9 }
 ];
 console.log(getTopScorers(players));

 var item = new Item("Laptop", 1000);
 console.log(item.finalPrice);

 console.log(safeDivide(10, 2));
 console.log(safeDivide(10, 0));
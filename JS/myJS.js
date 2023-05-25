//writing text to HTML through JS
//document.write("Hello World")

//Changing HTML element
document.getElementById("changeElement").innerHTML = "JavaScript Games: Programming Fundamentals";

//Function for Displaying Date and Time
function dateTime() {
    document.getElementById("dateTime").innerHTML = Date();
}

//Window Alert
window.alert("HELLO!");

//Data Types - Strings
let x = 20 + "String";
document.getElementById("datatype").innerHTML = x;

//Data Types - Booleans & Condional
let a =  5;
let b = 9;
let c = 5;

if (a != b) {
    document.getElementById("boolean").innerHTML = "This is false";
}

if (a == c) {
    document.getElementById("boolean2").innerHTML = "This is true";
}

//Array
let my_array = ["Ford", "Nissan", "Tesla", "Kia"];

//Display Index
document.getElementById("arrayIndex").innerHTML = my_array[2];

//Change Index
my_array[1] = "MG";
document.getElementById("changeArray").innerHTML = my_array[1];

//Display Full Array
document.getElementById("fullArray").innerHTML = my_array;

//Array Length
document.getElementById("arrayLength").innerHTML = my_array.length;

//For Loop
let text = "";
let i;

for (i = 0; i < 5; i++) {
    text += "The number is " + i + "<br>";
}
document.getElementById("forLoop").innerHTML = text;

//Function
function myFunction(p1, p2) {
    return p1 * p2;
}
document.getElementById("function").innerHTML = myFunction(50, 32);

//debugging
let xx = 20;
let yy = 8;
let zz = xx + yy;
console.log(zz);
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
// Function to calculate the change breakdown
function calculateChange(change) {
    var denominations = [50, 20, 10, 5, 2, 1];
    var changeBreakdown = [];
    for (var _i = 0, denominations_1 = denominations; _i < denominations_1.length; _i++) {
        var denom = denominations_1[_i];
        var count = Math.floor(change / denom);
        if (count > 0) {
            changeBreakdown.push.apply(changeBreakdown, Array(count).fill("R".concat(denom)));
            change -= count * denom;
        }
    }
    return changeBreakdown.join('-');
}
// Function to process transactions
function processTransactions(inputFile, outputFile) {
    var till = 500;
    var output = 'Till Start, Transaction Total, Paid, Change Total, Change Breakdown\n';
    var lines = fs.readFileSync(inputFile, 'utf-8').split('\n');
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        var parts = line.split(',');
        if (parts.length !== 2) {
            console.log("Invalid input format: ".concat(line));
            continue;
        }
        var items = parts[0];
        var payment = parts[1];
        console.log("Payment: ".concat(payment));
        if (!items || !payment) {
            console.log("Invalid input format: ".concat(line));
            continue;
        }
        // Calculate total cost of items
        var totalCost = items.split(';').reduce(function (acc, item) { return acc + parseInt(item.trim().split(' R').pop()); }, 0);
        // Calculate total paid
        var totalPaid = payment.split('-').reduce(function (acc, amounts) {
            var individualPayments = amounts.split('R');
            return acc + individualPayments.slice(1).reduce(function (subtotal, amount) { return subtotal + parseInt(amount); }, 0);
        }, 0);
        // Calculate change
        var change = totalPaid - totalCost;
        // Format change breakdown
        var changeBreakdown = calculateChange(change);
        // Write transaction details to output string
        output += "R".concat(till, ", R").concat(totalCost, ", R").concat(totalPaid, ", R").concat(change, ", ").concat(changeBreakdown, "\n");
        // Update till amount
        till += totalCost;
    }
    // Write amount left in till to output string
    output += "R".concat(till);
    // Write output string to file
    fs.writeFileSync(outputFile, output);
}
// Run the function with input and output file paths
processTransactions('input.txt', 'output.txt');

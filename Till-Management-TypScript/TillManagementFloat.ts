import * as fs from 'fs';

// Function to calculate the change breakdown
function calculateChange(change: number): string {
    const denominations = [50, 20, 10, 5, 2, 1];
    let changeBreakdown: string[] = [];
    for (let denom of denominations) {
        const count = Math.floor(change / denom);
        if (count > 0) {
            changeBreakdown.push(...Array(count).fill(`R${denom}`));
            change -= count * denom;
        }
    }
    return changeBreakdown.join('-');
}

// Function to process transactions
function processTransactions(inputFile: string, outputFile: string) {
    let till = 500;
    let output = 'Till Start, Transaction Total, Paid, Change Total, Change Breakdown\n';

    const lines = fs.readFileSync(inputFile, 'utf-8').split('\n');
    for (let line of lines) {
        const parts = line.split(',');
        if (parts.length !== 2) {
            console.log(`Invalid input format: ${line}`);
            continue;
        }
        const items = parts[0];
        const payment = parts[1];
        console.log(`Payment: ${payment}`);
        

        if (!items || !payment) {
            console.log(`Invalid input format: ${line}`);
            continue;
        }

        // Calculate total cost of items
        const totalCost = items.split(';').reduce((acc, item) => acc + parseInt(item.trim().split(' R').pop()!), 0);

        // Calculate total paid
const totalPaid = payment.split('-').reduce((acc, amounts) => {
    const individualPayments = amounts.split('R');
    return acc + individualPayments.slice(1).reduce((subtotal, amount) => subtotal + parseInt(amount), 0);
}, 0);


        // Calculate change
        const change = totalPaid - totalCost;

        // Format change breakdown
        const changeBreakdown = calculateChange(change);

        // Write transaction details to output string
        output += `R${till}, R${totalCost}, R${totalPaid}, R${change}, ${changeBreakdown}\n`;
        

        // Update till amount
        till += totalCost;
    }

    // Write amount left in till to output string
    output += `R${till}`;

    // Write output string to file
    fs.writeFileSync(outputFile, output);
}

// Run the function with input and output file paths
processTransactions('input.txt', 'output.txt');
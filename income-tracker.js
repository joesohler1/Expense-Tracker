// Income-tracker.js is going to store users data about their income
// and display them in a formatted way
const fs = require('fs');
const readline = require('readline-sync');

// Variables used throughout the code
let incomeData = []; // Array to store income data

// Ensure income-data.json exists and contains an array
if (!fs.existsSync('income-data.json') || fs.readFileSync('income-data.json', 'utf8').trim() === '') {
    fs.writeFileSync('income-data.json', '[]', 'utf8');
}

// Load income data from file at startup
try {
    const data = fs.readFileSync('income-data.json', 'utf8');
    if (data.trim() !== '') {
        incomeData = JSON.parse(data);
    }
} catch (error) {
    console.error('Error loading income data from file:', error);
    incomeData = [];
}

// Helper function to add a spacer for better readability
function spacer() {
    console.log(' ')
}
// Function to get a valid number
function getValidNumber(prompt) {
    let number;
    while (true) {
        number = readline.questionFloat(prompt);
        if (!isNaN(number) && number > 0) {
            return number;
        }
        console.log('Please enter a valid positive number.');
    }
}
// Function to get a valid integer
function getValidInteger(prompt) {
    let number;
    while (true) {
        number = readline.questionInt(prompt);
        if (!isNaN(number) && Number.isInteger(number) && number > 0) {
            return number;
        }
        console.log('Please enter a valid positive integer.');
    }
}
// Function to save income data to a file
function saveDataToFile() {
    try {
        fs.writeFileSync('income-data.json', JSON.stringify(incomeData, null, 2), 'utf8');
        console.log('Income data saved successfully.');
    } catch (err) {
        console.error('Error saving data to file:', err);
    }
}
// (Choice #1)Function to add income
function addIncome() {
    console.log('Adding income...');
    spacer();

    // Get source of income
    let source = readline.question('Enter the source of your income: ');
    // Validate source input
    while (source.trim() === '') {
        console.log('Invalid source. Please enter the source of your income: ');
        source = readline.question('Enter the source of your income: ');
        console.log('Source of income: ', source);
    }
    console.log('Source of income: ', source);
    spacer();

    // Get frequency of income
    let frequency = readline.question('Enter your income frequency: Weekly, bi-weekly, monthly, or yearly: ').toLowerCase();
    // Validate frequency input
    while (!['weekly', 'bi-weekly', 'monthly', 'yearly'].includes(frequency)) {
        console.log('Invalid frequency. Please enter Weekly, bi-weekly, monthly, or yearly.');
        frequency = readline.question('Enter your income frequency: ').toLowerCase();
        console.log('Frequency of income: ', frequency);
    }
    console.log('Frequency of income: ', frequency);
    spacer();

    // Get amount of income
    let amount = getValidInteger('Enter the amount of income per pay period: ');
    // Validate amount input
    while (amount <= 0) {
        console.log('Invalid amount. Please enter a positive integer.');
        amount = getValidInteger('Enter the amount of income per pay period: ');
    }
    console.log('Amount of income: $', amount);
    spacer();

    // Store income data in the incomeData array
    incomeData.push([source, amount, frequency]);
    console.log(`Income added: $${amount} from ${source} on a ${frequency} basis.`);
    saveDataToFile(); // Save income data to file
    return;
}
// (Choice #2) Function to view income
function viewIncome() {
    console.log('Viewing income...');
    spacer();

    if (incomeData.length === 0) {
        console.log('No income recorded yet.');
        return;
    }

    // Display each income entry
    incomeData.forEach(element => {
        console.log(`Source: ${element[0]} | Amount: $${element[1]} | Frequency: ${element[2]}`);
        console.log('__________________________________________________________');
    });
}
// (Choice #3) Function to calculate total income
function calculateTotalIncome() {
    console.log('Calculating total income...');
    spacer();

    if (incomeData.length === 0) {
        console.log('No income recorded yet.');
        return;
    }

    // Calculate total income based on frequency and show on a monthly and annual basis
    let totalMonthlyIncome = 0;
    let totalAnnualIncome = 0;

    incomeData.forEach(entry => {
        switch (entry[2]) {
            case 'weekly':
                totalMonthlyIncome += entry[1] * 4;
                totalAnnualIncome += entry[1] * 52;
                break;
            case 'bi-weekly':
                totalMonthlyIncome += entry[1] * 2;
                totalAnnualIncome += entry[1] * 26;
                break;
            case 'monthly':
                totalMonthlyIncome += entry[1];
                totalAnnualIncome += entry[1] * 12;
                break;
            case 'yearly':
                totalAnnualIncome += entry[1];
                break;
        }
    });

    console.log(`Total Monthly Income: $${totalMonthlyIncome}`);
    console.log(`Total Annual Income: $${totalAnnualIncome}`);
    spacer();
}
// (Choice #4) Function to edit income
function editIncome() {
    console.log('Editing income...');
    spacer();

    // Check if there are any income entries to edit
    if (incomeData.length === 0) {
        console.log('No income recorded yet.');
        return;
    }

    // Display current income entries by numbered order
    console.log('Current income entries:');
    spacer();
    incomeData.forEach((entry, index) => {
        console.log(`${index+1}. Source: ${entry[0]} | Amount: $${entry[1]} | Frequency: ${entry[2]}`);
    });
    spacer();

    // Ask user which entry they want to edit
    console.log('To edit an entry, please provide its index number.');
    let index = getValidInteger('Enter the index of the income entry to edit (starting from 1): ');
    while (index < 1 || index > incomeData.length) {
        console.log('Invalid index. Please try again.');
        index = getValidInteger('Enter the index of the income entry to edit (starting from 1): ');
    }
    let zeroIndex = index - 1; // Adjust for zero-based indexing

    // Ask user if they want to edit or delete the entry
    console.log(`You are editing entry ${index}: Source: ${incomeData[zeroIndex][0]} | Amount: $${incomeData[zeroIndex][1]} | Frequency: ${incomeData[zeroIndex][2]}`);
    let action = readline.question('Do you want to edit or delete this entry? (edit/delete): ').toLowerCase();
    while (action !== 'edit' && action !== 'delete') {
        console.log('Invalid action. Please enter "edit" or "delete".');
        action = readline.question('Do you want to edit or delete this entry? (edit/delete): ').toLowerCase();
    }
    spacer();
    if (action === 'delete') {
        // Delete the entry
        incomeData.splice(zeroIndex, 1);
        console.log(`Income entry deleted.`);
        saveDataToFile(); // Save updated data to file
        return;
    } else if (action === 'edit') {
        let source = readline.question(`Enter new source of income (current: ${incomeData[zeroIndex][0]}): `);
        let frequency = readline.question(`Enter new frequency of income (current: ${incomeData[zeroIndex][2]}): `).toLowerCase();
        while (!['weekly', 'bi-weekly', 'monthly', 'yearly'].includes(frequency)) {
            console.log('Invalid frequency. Please enter Weekly, bi-weekly, monthly, or yearly.');
            frequency = readline.question('Enter new frequency of income: ').toLowerCase();
        }
        let amount = getValidInteger(`Enter new amount of income per pay period (current: $${incomeData[zeroIndex][1]}): `);

        // Update the income entry
        incomeData[zeroIndex] = [source, amount, frequency];
        console.log(`Income entry updated: ${incomeData[zeroIndex][0]} | Amount: $${incomeData[zeroIndex][1]} | Frequency: ${incomeData[zeroIndex][2]}`);
        saveDataToFile(); // Save updated data to file
        return;
    }
}

// Main Function to start the income tracker
function main() {
    console.log('Welcome to the Income Tracker!');
    while (true) {
        spacer();
        console.log('Please choose an option:');
        console.log('1. Add Income');
        console.log('2. View Income');
        console.log('3. Calculate Total Income');
        console.log('4. Edit Income');
        console.log('5. Exit');
        spacer();
        // Get user choice
        let choice = getValidNumber('Enter your choice: ');
        spacer();

        if (choice === 1) {
            addIncome();
        } else if (choice === 2) {
            viewIncome();
        } else if (choice === 3) {
            calculateTotalIncome();
        } else if (choice === 4) {
            editIncome();
        } else if (choice === 5) {
            spacer();
            console.log('You chose to exit.')
            saveDataToFile(); // Save income data before exiting
            console.log('Thank you!');
            spacer();
            break;
        } else {
            spacer();
            console.log('Invalid choice. Please try again.');
            spacer();
        }
    }
}

// Export functions for testing or other modules
module.exports = {
    spacer,
    getValidNumber,
    getValidInteger,
    saveDataToFile,
    getDataFromFile,
    incomeData,
    addIncome,
    viewIncome,
    calculateTotalIncome,
    editIncome,
    saveDataToFile,
    main
};

// Function called to run the main function
//main();
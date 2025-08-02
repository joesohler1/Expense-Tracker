// expense-tracker.js
// This script allows users to track their expenses by 
// adding, viewing, and calculating total expenses.
const readlineSync = require('readline-sync');
const fs = require('fs');

// Helper function to validate user input is correct
function getValidNumber(promptText) {
    let input = readlineSync.question(promptText);
    if (input === 'go back') {
        return null; // Return null to indicate user wants to go back
    }
    let number = parseFloat(input);
    while (isNaN(number) || number <= 0 || number > 100000000) {
        console.log('Please enter a valid positive number up to $100,000,000.');
        input = readlineSync.question(promptText);
        if (input.toLowerCase() === 'go back') {
            return null; // Return null to indicate user wants to go back
        }
        number = parseFloat(input);
    }
    return number;
}
//Function to get data from JSON file
function getDataFromFile() {
    try {
        // Check if the file exists and is not empty
        if (!fs.existsSync('savedExpenses.json')) {
            console.log('savedExpenses.json file does not exist. Returning an empty array.');
            return [];
        }
        // Read the file and parse the JSON data
        const data = fs.readFileSync('savedExpenses.json', 'utf8');
                // Check if the file is empty
        if (data.trim() === '') {
            console.log('No data found in savedExpenses.json. Returning an empty array.');
            return [];
        }
        // Parse the JSON data
        const parsedData = JSON.parse(data);

        // Check if file is an array
        if (!Array.isArray(parsedData)) {
            console.error('savedExpenses.json does not contain a valid array. Returning an empty array.');
            return [];
        } 
        return parsedData;
    } catch (error) {
        console.error('Error reading file:', error);
        return [];
    }
}
// Function to save data to JSON file
function saveDataToFile() {
    try {
        // Write the data to the file
        fs.writeFileSync('savedExpenses.json', JSON.stringify(expenses, null, 2));
        console.log('Expenses saved successfully.');
    } catch (error) {
        console.error('Error saving expenses to file:', error);
    }
}
// Array to hold expenses
let expenses = getDataFromFile();
// Function to add an expense
function addExpense(amount, description) {
    expenses.push({ amount, description });
}
// Function to ask user for amount and description
// and add the expense to the expenses array
function choiceOne() {
    while (true) {
        console.log('Adding an expense...');
        amount = getValidNumber('Type "go back" to return to the main menu at any time.');
        if (amount === null) {
            return; // User chose to go back
        }
        let description = readlineSync.question('Enter expense description: ');
        if (description.toLowerCase() === 'go back') {
            return; // User chose to go back
        }
        while (description.trim() === '') {
            console.log('Description cannot be empty. Please enter a valid description.');
            description = readlineSync.question('Enter expense description: ');
            if (description.toLowerCase() === 'go back') {
                return; // User chose to go back
            }
        }
        addExpense(amount, description);
        console.log(`Added expense: ${description} - $${amount.toFixed(2)}`);
        // Save the updated expenses to the file
        saveDataToFile();
        // Ask if the user wants to add another expense
        console.log('Add another expense? (yes/no)');
        let addMore = readlineSync.question().toLowerCase();
        while (addMore !== 'yes' && addMore !== 'no') {
            console.log('Please enter "yes" or "no".');
            addMore = readlineSync.question().toLowerCase();
        }
        if (addMore !== 'yes') {
            console.log('Returning to the main menu...');
            break;
        } 
    }
}
// Function to view all expenses from the expenses array
// and display them in a formatted way
function choiceTwo() {
    console.log('Viewing expenses...');
    if (expenses.length === 0) {
        console.log('No expenses recorded yet.');
        return;
    }
    for (let i = 0; i < expenses.length; i++) {
        console.log(`Amount: -$${expenses[i].amount.toFixed(2)} | Description: ${expenses[i].description}`);
    }
    return;
}
// Function to calculate total expenses from the expenses array
// and display the total amount
function choiceThree() {
    console.log('Calculating expenses...');
    let total = 0;
    if (expenses.length === 0) {
        console.log('No expenses recorded yet.');
        return;
    }
    for (let i = 0; i < expenses.length; i++) {
        total += expenses[i].amount;
    }
    console.log(`Total expenses: $${total.toFixed(2)}`);
    return;
}
// Function to display the current expenses and prompt the user for actions
function choiceFour() {
    console.log('Current expenses:');
    if (expenses.length === 0) {
        console.log('No expenses recorded yet.');
        return;
    } else { while (true) {
            for (let i = 0; i < expenses.length; i++) {
                console.log(`${i+1}. Amount: -$${expenses[i].amount.toFixed(2)} | Description: ${expenses[i].description}`);
            }
            console.log("Choose which expense to edit or delete, by typing it's corresponding number.");
            console.log('Type "go back" to return to the main menu.');
            number = getValidNumber('Enter number: ');
            if (number === null) {
                return; // User chose to go back
            }
            console.log(`You chose to edit or delete expense: ${expenses[number].description} - $${expenses[number].amount.toFixed(2)}`);
            console.log('Type "edit" to edit the expense or "delete" to delete it.');
            let action = readlineSync.question('Enter action: ').toLowerCase();
            while (action !== 'edit' && action !== 'delete' && action !== 'go back') {
                console.log('Invalid action. Please type "edit", "delete" or "go back".');
                action = readlineSync.question('Enter action: ').toLowerCase();
            }
            if (action === 'edit') {
                amount = getValidNumber('Enter new amount: $');
                if (amount === null) {
                    return; // User chose to go back
                }
                let newDescription = readlineSync.question('Enter new description: ');
                if (newDescription === 'go back') {
                    return;
                }
                while (newDescription.trim() === '') {
                    console.log('Description cannot be empty. Please enter a valid description.');
                    newDescription = readlineSync.question('Enter new description: ');
                }
                expenses[number].amount = amount;
                expenses[number].description = newDescription;
                console.log(`Expense updated: ${expenses[number].description} - $${expenses[number].amount.toFixed(2)}`);
                saveDataToFile();
            } else if (action === 'delete') {
                expenses.splice(number, 1);
                console.log(`Expense deleted.`);
                saveDataToFile();
            } else if (action === 'go back') {
                console.log('Returning to the main menu...');
                return;
            }
            // Ask user if they would like to keep editing or deleting expenses
            console.log('Would you like to edit or delete another expense? (yes/no)');
            let continueEditing = readlineSync.question().toLowerCase();
            while (continueEditing !== 'yes' && continueEditing !== 'no') {
                console.log('Please enter "yes" or "no".');
                continueEditing = readlineSync.question().toLowerCase();
            }
            if (continueEditing !== 'yes') {
                console.log('Returning to the main menu...');
                break;
            }
        } 
    }
    return;
}

// Main user prompt loop
function userPrompt() {
    if (expenses.length > 0) {
        console.log(`Loaded ${expenses.length} expenses from file.`);
    } else {
        console.log('No expenses found in file. Starting with an empty list.');
    }
    while (true) {
        const prompt = readlineSync.question('Press 1 to add an expense, 2 to view expenses, 3 to calculate expenses, 4 to edit or delete expenses, or 5 to exit: ');
        const choice = parseInt(prompt, 10);
        if (isNaN(choice) || choice < 1 || choice > 5) {
            console.log('Invalid choice. Please enter a number between 1 and 5.');
            continue;
        }
        console.log(`You chose: ${choice}`);
        // Check if the user wants to go back to the main menu and add expense
        if (choice === 1) {
            choiceOne();
        } else if (choice === 2) {
            choiceTwo();
        } else if (choice === 3) {
            choiceThree();
        } else if (choice === 4) {
            choiceFour();
        } else if (choice === 5) {
            console.log('Exiting...');
            saveDataToFile(); // Save expenses before exiting
            break;        
        }
    }
}

// Start the user prompt
userPrompt();
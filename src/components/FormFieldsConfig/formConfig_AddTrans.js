// src/formConfig.js
export const formFields = [

    {
        type: 'date',
        key: 'Tdate',
        label: 'Transaction Date',
        gridSize: 4,
    },
    {
        type: 'text',
        key: 'Amount',
        label: 'Amount',
        placeholder: 'Enter your Amount',
       gridSize: 4,
    },

    {
        type: 'dropdown',
        key: 'TOE',
        label: 'Expense Type',
        options: [
            { value: 1, label: 'Food' },
            { value: 2, label: 'Housing' },
            { value: 3, label: 'Groceries' },
            { value: 4, label: 'Travel' },
            { value: 5, label: 'Medical' },
            { value: 6, label: 'Entertainment' },
            { value: 7, label: 'Other Expenses' }
        ],
        gridSize: 4,
    },
    {
        type: 'dropdown',
        key: 'TOT',
        label: 'Transaction Type',
        options: [
            { value: 1, label: "Credit" },
            { value: 2, label: "Debit" },
        ],
        gridSize: 4,
    },
    {
        type: 'text',
        key: 'Descrp',
        label: 'Description',
        placeholder: 'Enter your Descrp',
        gridSize: 4,
    },

];

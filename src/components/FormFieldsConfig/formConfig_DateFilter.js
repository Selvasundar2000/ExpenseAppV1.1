// src/formConfig.js
export const formFields = [  
  {
    type: 'date',
    key: 'FilterStartDate',
    label: 'Start Date',
  }, 
  {
    type: 'date',
    key: 'FilterEndDate',
    label: 'End Date',
  },  
  {
     type: 'radio',
     key: 'FilterTOT',
     label: 'Transaction Type',
     options: [
       { label: 'Credit', value: '1' },
       { label: 'Debit', value: '2' },
     ],
   },
];

const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    category: { 
        type: String, 
        required: true 
    },
    value: { 
        type: Number, 
        required: true 
    },
    isRefund: { 
        type: Boolean, 
        default: false 
    },
    account: { 
        type: String, 
        required: true 
    },
    checked: { 
        type: Boolean, 
        default: true 
    },
    date: { 
        type: Date, 
        required: true 
    },
    time: { 
        type: String, 
        required: true 
    },
    from: { 
        type: String, 
        default: '' 
    },
    notes: { 
        type: String, 
        default: '' 
    },
});

module.exports = mongoose.model('Expense', ExpenseSchema);
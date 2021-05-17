const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const payments = () => {
    var UserSchema = new Schema({
        payment_id: { type: String, default: "" },
        amount: { type: Number, default: 0 },
        status: { type: String, required: true }, // pending, approved, cancelled
        date: { type: Date, default: Date.now() },
        type: { type: String, required: true }, // deposit, withdraw, transfer
        method: { type: String, required: true }, // paypal, payoneeer, credit card, ...
        currency: { type: String, default: "USD" }
    })

    return mongoose.model("payments", UserSchema);
}

module.exports = {
    payments: payments()
}
const { paymentReturnURL, paymentCancelURL, paypalClientID, paypalClientSecret, stripeSecret } = require("../config/index.json")
const qs = require('qs');
const axios = require('axios');
const baseController = require("./basecontroller")
const PAYMENT_MODEL = require("../models/payment_model").payments
const { base64encode } = require('nodejs-base64');
const stripe = require('stripe')(stripeSecret);

exports.depositWithPaypal = async (req, res, next) => {
    const paymentInfo = req.body;
    const { username } = JSON.parse(req.headers.login)
    const paypalDetail = {
        "intent": "sale",
        "payer": {
          "payment_method": "paypal"
        },
        "transactions": [{
          "amount": {
            "total": paymentInfo.amount,
            "currency": "AUD",
            "details": {
              "subtotal": paymentInfo.amount,
              "tax": "0",
              "shipping": "0",
              "handling_fee": "0",
              "shipping_discount": "0",
              "insurance": "0"
            }
          }
        }],
        "redirect_urls": {
          "return_url": paymentReturnURL,
          "cancel_url": paymentCancelURL
        }
    }

    const baseAuth = base64encode(`${paypalClientID}:${paypalClientSecret}`)
    var data = qs.stringify({
        'grant_type': 'client_credentials'
    });
    var config = {
        method: 'post',
        url: 'https://api.sandbox.paypal.com/v1/oauth2/token',
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded', 
            'Authorization': `Basic ${baseAuth}`,
        },
        data : data
    };

    axios(config)
    .then(function (response) {
        const { access_token, token_type } = response.data;
        var config = {
            method: 'post',
            url: 'https://api.sandbox.paypal.com/v1/payments/payment',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `${token_type} ${access_token}`,
            },
            data : JSON.stringify(paypalDetail)
        };
        
        axios(config)
        .then(async function (response) {
            var sdata = await baseController.data_save({payment_id: response.data.id, user_id: username, amount: paymentInfo.amount, status: "pending", type: "deposit", method: "Paypal", currency: "AUD"}, PAYMENT_MODEL)
            if (sdata) {
                return res.json({
                    status: true,
                    data: {
                        payment_id: response.data.id,
                        url: response.data.links.find(item => item.rel == "approval_url").href
                    }
                })
            }
        })
        .catch(function (error) {
            return res.json({
                status: false,
                data: "Server Error!"
            })
        });
    })
    .catch(function (error) {
        return res.json({
            status: false,
            data: "Server Error!"
        })
    });
}

exports.paymentUpdate = async (req, res, next) => {
    console.log(`req.body`, req.body)
    const { payment_id, status } = req.body
    var udata = await baseController.BfindOneAndUpdate(PAYMENT_MODEL, { payment_id }, { status })
    console.log(`udata`, udata)
    if (udata) {
        return res.json({
            status: true
        })
    } else {
        return res.json({
            status: false,
            data: "Server Error!"
        })
    }
}

exports.stripCardCreateSetupIntent = async (req, res, next) => {
    const { username } = JSON.parse(req.headers.login)
    const { amount } = req.body
    const customer = await stripe.customers.create();

    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'aud',
        customer: customer.id
    });
    console.log(`paymentIntent`, paymentIntent)
    const clientSecret = paymentIntent.client_secret;
    var sdata = await baseController.data_save({payment_id: paymentIntent.id, user_id: username, amount, status: "pending", type: "deposit", method: "Credit Card", currency: "AUD"}, PAYMENT_MODEL)
    if (sdata) {
        return res.json({
            status: true,
            data: clientSecret,
            paymentId: paymentIntent.id
        })
    } else {
        return res.json({
            status: false,
            data: "Server Error! Please try again later."
        })
    }
}

exports.loadPaymentHistory = async (req, res, next) => {
    const { username } = JSON.parse(req.headers.login)
    var data = await baseController.Bfind(PAYMENT_MODEL, { user_id: username })
    if (data) {
        return res.json({
            status: true,
            data
        })
    } else {
        return res.json({
            status: false,
            data: "Server Error! Please try again."
        })
    }
}
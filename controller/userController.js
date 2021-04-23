const BASECONTROLLER = require("./basecontroller");
const axios = require("axios");
const md5 = require("md5");
const SESSION_MODEL = require("../models/users_model").userSession;

exports.login = async (req, res, next) => {
    axios({
        url: "https://myyaak.com/restful_api/token",
        method: "POST",
        data: {
            ...req.body,
            grant_type:"password"
        },
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic bW9iaWxlYXBpOjczOGFiNWI4M2M5MDJhN2I4MTg2MGUwNTgxMWZkNWNkNjVlOTVmNzI="
        }
    })
    .then(async (response) => {
        var token = md5(JSON.stringify(response.data))

        var sdata = await BASECONTROLLER.data_save({token, updatedAt: Date.now()}, SESSION_MODEL);
        if (sdata) {
            res.json({
                status: true,
                data: {
                    ...response.data,
                    session_token: token
                }
            })
            return next();
        } else {
            res.json({
                status: false,
                data: "Server Error! Please try again later."
            })
        }
    }).catch(error => {
        res.json({
            status: false,
            data: error.response.data.error_description
        })
        return next();
    })
}
// paul.napper09@gmail.com
// shy8cozy

exports.getUserData = async (req, res, next) => {
    console.log(`req.body`, req.body)
}
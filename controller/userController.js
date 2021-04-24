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

        var sdata = await BASECONTROLLER.data_save({token, apiToken: response.data, updatedAt: Date.now()}, SESSION_MODEL);
        if (sdata) {
            res.json({
                status: true,
                data: {
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
    const { token } = JSON.parse(req.headers.user);
    const { apiToken } = await BASECONTROLLER.BfindOne(SESSION_MODEL, { token: token.session_token })
    axios({
        url: "https://myyaak.com/restful_api/user/mine",
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + apiToken.access_token
        }
    }).then(async (response) => {
        console.log(`response`, response)
        res.json({
            status: true,
            data: response.data
        })
        return next();
    }).catch(error => {
        res.json({
            status: false,
            data: error.response.data.error_description
        })
        return next();
    })
}
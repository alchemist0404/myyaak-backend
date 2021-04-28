const BASECONTROLLER = require("./basecontroller")
const axios = require("axios")
const md5 = require("md5")
const SESSION_MODEL = require("../models/users_model").userSession
const USER_MODEL = require("../models/users_model").adminUser
const { BASE_URL } = require("../config/index.json")

exports.login = async (req, res, next) => {
    axios({
        url: `${BASE_URL}token`,
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

        var sdata = await BASECONTROLLER.data_save({token, apiToken: response.data, updatedAt: Date.now()}, SESSION_MODEL)
        if (sdata) {
            res.json({
                status: true,
                data: {
                    session_token: token
                }
            })
            return next()
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
        return next()
    })
}
// paul.napper09@gmail.com
// shy8cozy

exports.getUserData = async (req, res, next) => {
    const { token } = JSON.parse(req.headers.user)
    const { apiToken } = await BASECONTROLLER.BfindOne(SESSION_MODEL, { token: token.session_token })
    axios({
        url: `${BASE_URL}user/mine`,
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + apiToken.access_token
        }
    }).then(async (response) => {
        res.json({
            status: true,
            data: response.data
        })
        return next()
    }).catch(error => {
        res.json({
            status: false,
            data: error.response.data.error_description
        })
        return next()
    })
}

exports.adminLogin = async (req, res, next) => {
    const { email, password } = req.body
    var vdata = await BASECONTROLLER.BfindOne(USER_MODEL, { email, password: md5(password) })
    if (vdata) {
        var udata = await BASECONTROLLER.BfindOne(USER_MODEL, { email })
        if (udata) {
            res.json({
                status: true,
                data: udata
            })
        } else {
            res.json({
                status: false,
                data: "Server Error! Please try again later."
            })
        }
    } else {
        res.json({
            status: false,
            data: "Email or password is invalid!"
        })
        return next()
    }
}

exports.updateUserData = async (req, res, next) => {
    const { token } = JSON.parse(req.headers.user)
    const { id, email, fullName, password } = req.body

    const { apiToken } = await BASECONTROLLER.BfindOne(SESSION_MODEL, { token: token.session_token })
    const data = {
        id,
        email,
        full_name: fullName,
        password
    }
    var response = await axios({
        method: "put",
        url: `${BASE_URL}user/` + id,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + apiToken.access_token
        },
        data: data
    })
    if (response.data.status == 'success') {
        res.json({
            status: true,
            data: response.data
        })
    } else {
        res.json({
            status: false,
            data: "Server Error! Please try again later."
        })
    }
    // next()
}
const BASECONTROLLER = require("./basecontroller")
const axios = require("axios")
const md5 = require("md5")
const SESSION_MODEL = require("../models/users_model").userSession
const ADMIN_USER_MODEL = require("../models/users_model").adminUser
const USER_MODEL = require("../models/users_model").userPlayers
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
        var token = md5(Date.now())

        var fdata = BASECONTROLLER.BfindOne(USER_MODEL, { username: req.body.username })
        if (!fdata) {
            BASECONTROLLER.data_save({username: req.body.username}, USER_MODEL)
        }

        var sdata = await BASECONTROLLER.data_save({token, apiToken: response.data, updatedAt: Date.now()}, SESSION_MODEL)
        if (sdata) {
            return res.json({
                status: true,
                data: {
                    session_token: token
                }
            })
        } else {
            return res.json({
                status: false,
                data: "Server Error! Please try again later."
            })
        }
    }).catch(error => {
        return res.json({
            status: false,
            data: error.response.data.error_description
        })
    })
}

exports.getUserData = async (req, res, next) => {
    const { token } = JSON.parse(req.headers.user)
    const { username } = JSON.parse(req.headers.login);
    const { apiToken } = await BASECONTROLLER.BfindOne(SESSION_MODEL, { token: token.session_token })
    axios({
        url: `${BASE_URL}user/mine`,
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + apiToken.access_token
        }
    }).then(async (response) => {
        BASECONTROLLER.BfindOneAndUpdate(USER_MODEL, {username}, {fullName: response.data.data.full_name})
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
    const vdata = await BASECONTROLLER.BfindOne(ADMIN_USER_MODEL, { email, password: md5(password) })
    if (vdata) {
        var token = md5(Date.now())
        const tdata = await BASECONTROLLER.data_save({token, apiToken: {}, updatedAt: Date.now()}, SESSION_MODEL)
        if (tdata) {
            res.json({
                status: true,
                data: {
                    ...vdata,
                    token
                }
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

exports.getAllUsers = async (req, res, next) => {
    var data = await BASECONTROLLER.Bfind(USER_MODEL, {})
    if (data) {
        return res.json({
            status: true,
            data
        })
    } else {
        return res.json({
            status: false,
            data: "Server Error! Please try again later."
        })
    }
}
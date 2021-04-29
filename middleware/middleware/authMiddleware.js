const BASECONTROL = require("../../controller/basecontroller");
const SESSION_MODEL = require("../../models/users_model").userSession;
const axios = require("axios");

const auth = {
    
    // checks if the user is logged in, if not, redirect to the 
    // unauthorized route
    isLoggedIn: async (req, res, next)=> {
        try{
            const { token } = JSON.parse(req.headers.user);
            const loginInfo = JSON.parse(req.headers.login);
            const expireTime = 3600 * 1000;

            var session = await BASECONTROL.BfindOne(SESSION_MODEL, { token: token.session_token });
            if (session.updatedAt.valueOf() + expireTime < Date.now().valueOf()) {
                BASECONTROL.BfindOneAndDelete(SESSION_MODEL, { token: token.session_token })
                return res.json({
                    session: true
                })
            } else {
                BASECONTROL.BfindOneAndUpdate(SESSION_MODEL, { token: token.session_token }, { updatedAt: Date.now() })
                
                await axios({
                    url: "https://myyaak.com/restful_api/user/mine",
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + session.apiToken.access_token
                    }
                }).catch(async (error) => {
                    console.log(`error.response`, error.response)
                    if (error.response.data == 'invalid_token') {
                        axios({
                            url: "https://myyaak.com/restful_api/token",
                            method: "POST",
                            data: {
                                ...loginInfo,
                                grant_type:"password"
                            },
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Basic bW9iaWxlYXBpOjczOGFiNWI4M2M5MDJhN2I4MTg2MGUwNTgxMWZkNWNkNjVlOTVmNzI="
                            }
                        }).then(async (response) => {
                            await BASECONTROL.BfindOneAndUpdate(SESSION_MODEL, { token: token.session_token }, { apiToken: response.data })
                        })
                    }
                })
                next()
            }
        } catch(e) {
            return res.json({session : true});
        }
    },
    isAdminLoggedIn: async (req, res, next) => {
        try {
            const { token } = JSON.parse(req.headers.user);
            // const expireTime = 3600 * 1000;

            var session = await BASECONTROL.BfindOne(SESSION_MODEL, { token });
            if (session.updatedAt.valueOf() + expireTime < Date.now().valueOf()) {
                BASECONTROL.BfindOneAndDelete(SESSION_MODEL, { token })
                return res.status(401).json({
                    session: true
                })
            } else {
                BASECONTROL.BfindOneAndUpdate(SESSION_MODEL, { token }, { updatedAt: Date.now() })
                next()
            }
        } catch (e) {
            return res.status(401).json({
                session: true
            })
        }
    }
}

module.exports = auth;
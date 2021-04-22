const BASECONTROL = require("./basecontroller");

exports.getUserLoad = async (req,res,next) =>{
    var mainuser = BASECONTROL.getUserItem(req);
    var CONFIG = req.homeConfig;
    var m_users =  await this.getMainUsers(mainuser,CONFIG);
    let data = [];
    for (var i in m_users) {
        data.push({value : m_users[i].email,label : m_users[i].email + "    " + m_users[i].permissionid.title + "    " + ( 100 - parseInt(m_users[i].positiontaking)) });
    }
    res.json({status : true,data : data});
    return next();
}
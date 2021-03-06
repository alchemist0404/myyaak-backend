const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const users = () =>{
    var  UserSchema = new Schema({
        email : { type: String, required: true },  
        full_name: { type: String, default: "" },
        password: { type: String, required: true }
    });

    // UserSchema.methods.generateHash = function (password) {
    //     return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    // }
      
    // UserSchema.methods.validPassword = function (password, encrypted) {
    //     return bcrypt.compareSync(password, encrypted);
    // }
    
    
    // UserSchema.pre('save', function() {
    //     this.set({ fakeid: get_max_id() });
    // });

    // UserSchema.pre('find', function () {
    //     // `this` is an instance of mongoose.Query
    //     this.populate('playerid',["balance","bonusbalance"]).populate('permissionid',["title","id","pid"]);
    //     this.select(["username","email","password",
    //     ]);
    // });
   

    // UserSchema.pre('findOne', function () {
    //     // `this` is an instance of mongoose.Query
    //     this.populate('playerid',["balance","bonusbalance"]).populate('permissionid',["title","id","pid"]);
    //     this.select(["username","email","password",
    //     ]);
    // });

    // UserSchema.pre('findOneAndUpdate', function() {
    //     this.set({ updatedAt: Date.now()});
    // });
    // UserSchema.pre('updateOne', function() {
    //     this.set({ updatedAt: Date.now() });
    // });

   
    return mongoose.model("user_users", UserSchema)
    // return mongoose.model("user1", UserSchema)
}

const userPlayers = () => {
    var UserSchema = new Schema({
        username: { type: String, required: true },
        fullName: { type: Object, default: "" },
        collectedLogos: { type: Number, default: 0 },
        balance: { type: Number, default: 0 },
        points: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now() },
    })

    return mongoose.model("user_players", UserSchema)
}

const userSession = () => {
    var UserSchema = new Schema({
        token: { type: String, required: true },
        updatedAt: { type: Date, required: true },
        apiToken: { type: Object, required: true }
    })

    return mongoose.model("user_sessions", UserSchema)
}

function get_max_id (){
    var a = new Date().valueOf() + "";
    var b=  a.slice((a.length-1-7),(a.length-1));
    return b;
}

module.exports = {
    adminUser : users(),
    userSession : userSession(),
    userPlayers: userPlayers()
}
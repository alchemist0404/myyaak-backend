const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const users = () =>{
    var  UserSchema = new Schema({
        fakeid : { type : Number },  
        date: { type: Date,  },
        updatedAt: { type: Date,  },
        email : { type : String, required : true,unique: true,},
    });

    UserSchema.methods.generateHash = function (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    }
      
    UserSchema.methods.validPassword = function (password, encrypted) {
        return bcrypt.compareSync(password, encrypted);
    }
    
    
    UserSchema.pre('save', function() {
        this.set({ fakeid: get_max_id() });
    });

    UserSchema.pre('find', function () {
        // `this` is an instance of mongoose.Query
        this.populate('playerid',["balance","bonusbalance"]).populate('permissionid',["title","id","pid"]);
        this.select(["username","email","password",
        ]);
    });
   

    UserSchema.pre('findOne', function () {
        // `this` is an instance of mongoose.Query
        this.populate('playerid',["balance","bonusbalance"]).populate('permissionid',["title","id","pid"]);
        this.select(["username","email","password",
        ]);
    });

    UserSchema.pre('findOneAndUpdate', function() {
        this.set({ updatedAt: Date.now()});
    });
    UserSchema.pre('updateOne', function() {
        this.set({ updatedAt: Date.now() });
    });

   
    return mongoose.model("user_users", UserSchema)
    // return mongoose.model("user1", UserSchema)
}

function get_max_id (){
    var a = new Date().valueOf() + "";
    var b=  a.slice((a.length-1-7),(a.length-1));
    return b;
}

module.exports  = {
    adminUser : users(),
}
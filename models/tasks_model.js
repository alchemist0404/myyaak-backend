const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tasks = () => {
    var UserSchema = new Schema({
        task_name: { type: String, default: "" },
        task_position: { type: Object, required: true },
        task_file: { type: String, required: true },
        file_type: { type: String, required: true }
    })

    return mongoose.model("tasks", UserSchema);
}

module.exports = {
    tasks: tasks()
}
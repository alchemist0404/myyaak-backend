const TASKS_MODEL = require("../models/tasks_model").tasks
const USER_MODEL = require("../models/users_model").adminUser
const BASECONTROLLER = require("../controller/basecontroller")
const { BASEURL } = require("../db")
const fs = require("fs")
const md5 = require("md5")

exports.add = async (req, res, next) => {
    if (!BASECONTROLLER.validTaskFileType(req.files[0])) {
        return res.json({
            status: false,
            data: "Invalid file type! Please upload only video or image or 3D models."
        })
    }
    const position = JSON.parse(req.body.position)

    var cdata = await BASECONTROLLER.BfindOne(TASKS_MODEL, {"task_position.lat": position.lat, "task_position.lng": position.lng})
    if (cdata) {
        res.json({
            status: false,
            data: "A task is already exists on the same position!"
        })
        return next()
    } else {
        var sdata = await BASECONTROLLER.data_save({task_name: req.body.taskName, task_position: position, task_file: req.files[0].filename}, TASKS_MODEL)
        if (sdata) {
            this.getTasks(req, res, next)
        } else {
            res.json({
                status: false,
                data: "Server Error! Please try again later."
            })
            return next()
        }
    }
}

exports.getTasks = async (req, res, next) => {
    var data = await BASECONTROLLER.Bfind(TASKS_MODEL, {})
    if (data) {
        res.json({
            status: true,
            data: data
        })
        return next()
    } else {
        res.json({
            status: false,
            data: "Server Error! Please try again later."
        })
        return next()
    }
}

exports.deleteTask = async (req, res, next) => {
    const { _id } = req.body
    var file = await BASECONTROLLER.BfindOne(TASKS_MODEL, { _id })
    if (file) {
        fs.unlink(BASEURL + file.task_file, (err) => {
            if (err) {
                console.log(`err`, err)
            }
        })
    }
    var data = await BASECONTROLLER.BfindOneAndDelete(TASKS_MODEL, { _id })

    if (data) {
        this.getTasks(req, res, next)
    } else {
        res.json({
            status: false,
            data: "Server Error! Please try again later."
        })
        return next()
    }
}

async function run() {
    var password = md5("apfxlrj000!")
    var user = await BASECONTROLLER.data_save({email: "superAdmin@myyaak.com", password, full_name: "Myyaak"}, USER_MODEL)
    if (user) {
        console.log("Successfully added")
    } else {
        console.log("Error")
    }   
}

run()
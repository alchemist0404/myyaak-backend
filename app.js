const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const config = require('./db')
const app = express()
const server = require("http").Server(app)
const io = require("socket.io").listen(server);
const SocketServer = require("./socket");
const adminRouter = require("./adminRouter")
const playerRouter = require("./playerRouter")
const path = require("path")

mongoose.connect(config.PRODB, { useNewUrlParser: true ,useFindAndModify: false,useUnifiedTopology: true,useCreateIndex : true}).then(() => {
  console.log('Database is connected')

  app.use(cors())

  app.use(bodyParser.json({limit: "15360mb", type:'application/json'}))
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use('/admin', adminRouter)
  app.use('/player', playerRouter)
  app.use(express.static("./clients"))
  app.use(express.static("./upload"))

  SocketServer(io)
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(config.DIR, 'clients/index.html'))
  })

  server.listen(config.ServerPort, () => {
    console.log(`Started server on => http://localhost:${config.ServerPort}`)
  })
  },
  err => { console.log('Can not connect to the database' + err) }
)
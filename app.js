const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./db');
const app = express();
const server = require("http").Server(app);
const adminRouter = require("./router");
const path = require("path");

mongoose.connect(config.TESTDB, { useNewUrlParser: true ,useFindAndModify: false,useUnifiedTopology: true,useCreateIndex : true}).then(() => {
  console.log('Database is connected');

  app.use(cors());

  app.use(bodyParser.json({limit: "15360mb", type:'application/json'}));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use('/admin', adminRouter);
  // app.use('/player', playerRouter)
    
  app.get('*', (req, res) => {
    res.sendFile(path.join(config.DIR, 'clients/builds/index.html'));  
  });
  

  server.listen(config.ServerPort, () => {
    console.log(`Started server on => http://localhost:${config.ServerPort}`);
  });
  },
  err => { console.log('Can not connect to the database' + err) }
);
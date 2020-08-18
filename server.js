const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const config = require('./DB/db');
const URLShortenerRoute = require('./Router/URLShortenerRoute');
const bodyParser = require('body-parser');
const app = express();
//////////////////// DB Conection
// use mongoose with native Node promise
mongoose.Promise = global.Promise;
// create DB connection 
// We can create multiple db connections using CreateServer() of NodeJS
mongoose.connect(config.DB, {useNewUrlParser:true})
.then(() => console.log('DB Connection success!'))
.catch((err)=>console.log(err));

app.use(bodyParser.json());
app.use(cors());
app.use(URLShortenerRoute);
let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Listining to port: ' + port);    
});

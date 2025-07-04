require('dotenv').config({debug:false});
const express = require('express');
const ConnectDB = require("./config/mongoose");
const userRoute = require('./Routes/user');
const groupRoute = require('./Routes/group')
const cookieParser = require('cookie-parser');

let app = express();
app.use(express.json());  // to parse JSON body
app.use(cookieParser());
ConnectDB();
app.use('/user',userRoute);
app.use('/group',groupRoute);
app.listen(3000);

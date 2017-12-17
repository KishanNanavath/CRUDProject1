/**
 * Created by Balkishan on 12/2/2017.
 */

var TAG = 'app.js';

var env = require('./Environment/env.js').env;
var path = require('path');
var dbConfig = require('./Environment/mongoDatabase.js');
var express = require('express');
var app = express();
var morgan = require('morgan');
var mongoose    = require('mongoose');
var config = require('./config.js');

//var session = require('express-session');
//app.use(session({secret: 'ssshhhhh'}));

mongoose.connect(config.database);
app.set('secret', config.secret);

var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

app.use('/static', express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    req.headers['if-none-match'] = 'no-match-for-this';
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});
app.disable('etag');
app.use(morgan('dev'));

var userFolder = require('./routes/user/user.js');
app.use('/user',userFolder);

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname,'public/HTML','authenticate.html'));
});

//dbConfig.createMongoConn(function(error){
//    if(error){
//        console.log('Unable to connect to the mongoDB server. Error:', error);
//    }
//    else{
        if (env === "prd") {
            app.listen(3000);
            console.log('Listening on port 3000');
        } else if (env === "stg") {
            app.listen(3000);
            console.log('Listening on port 3000');
        } else if (env === "dev") {
            app.listen(3000);
            console.log('Listening on port 3000');
        }else if (env === "demo") {
            app.listen(3000);
            console.log('Listening on port 3000');
        }else {
            //loc
            app.listen(3000);
            console.log('Listening on port 3000');
        }
//    }
//});
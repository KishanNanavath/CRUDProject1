/**
 * Created by Balkishan on 12/2/2017.
 */
var express = require('express');
var app = express();
var User = require('../../models/user.js'); // get our mongoose model
var jwt    = require('jsonwebtoken');
var async = require('async');

app.post('/register', function (req, res) {

    async.series([
        function (asyncCallback) {
            //check for document with existing email id
            User.findOne({
                email:req.body.email
            }, function (error, result) {
                if(error) throw error;
                if(result){
                    return asyncCallback(true,"user with email id : "+req.body.email+" already exists");
                }
                else{
                    return asyncCallback(false);
                }
            })
        },
        //create new user with given email id
        function (asyncCallback) {
            var nick = new User(req.body);

            // save the sample user
            nick.save(function(err,user) {
                console.log(JSON.stringify(user));
                if (err) throw err;

                return asyncCallback(false,user);
            });
        }
    ], function (error, result) {
        if(error){
            var retObj = {
                success : false,
                message : result[result.length-1]
            };
            res.status(400);
            res.json(retObj);
        }
        else{
            console.log('User saved successfully');
            console.log(result);
            var user = result[result.length-1];
            var token = generateToken(user);

            var retObj = {
                success: true,
                obj:user,
                message: 'Enjoy your token!',
                token: token
            };
            res.status(200);
            res.json(retObj);
        }
    });
});

app.post('/login', function (req, res) {
    User.findOne({
        email:req.body.email,
        password:req.body.password
    }, function (err, user) {
        if (err) throw err;
        if (!user) {
            res.status(400);
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {
            var token = generateToken(user);
            res.status(200);
            res.json({
                success: true,
                message: 'Enjoy your token!',
                token: token
            });
    }
    });
});

app.use(function (req, res,next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('secret'), function(err, decoded) {
            console.log(JSON.stringify(err));
            console.log(JSON.stringify(decoded));
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                console.log(decoded);
                next();
            }
        });
    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
});

app.post('/listUsers', function (req, res) {
    User.find({}, function (err, users) {
        res.status(200);
        res.json(users);
    }) 
});

app.post('/getUserData', function (req, res) {
    User.findOne({
        email:req.body.email
    }, function (err, user) {
        if(err) throw err;
        res.status(200);
        res.json(user);
    })
});

app.post('/updateUserData', function (req, res) {
    var findQuery = {
        email:req.body.email
    };

    var updateQuery = req.body;

    User.update(findQuery,updateQuery, function (error, result) {
        if(error) throw error;
        console.log(JSON.stringify(error));
        console.log(JSON.stringify(result));
        res.send('ok');
    })
});

function generateToken(user){
    const payload = {
        admin: user._id,
        exp: Math.floor(Date.now() / 1000) + (10)
    };
    var token = jwt.sign(payload, app.get('secret'));
    return token;
}

module.exports = app;
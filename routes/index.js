const mongoose = require('mongoose');
const mongoCredentials = 'mongodb://18.216.106.47/swoletracker';
const bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;
mongoose.connect(mongoCredentials);
var userSchema = new mongoose.Schema({
    email: "",
    password: "",
    age: "",
});

var weightSchema = new mongoose.Schema({
    weight: "",
    date: "",
    email:""
});

var nutrientsSchema = new mongoose.Schema({
    date: "",
    a: "",
    c: "",
    protein: "",
    calcium: "",
    iron: "",
    sodium: "",
    email: ""

});

var calsSchema = new mongoose.Schema({

    date: "",
    totalCals: "",
    caloriesIn: "",
    caloriesOut: "",
    totalSteps: "",
    totalDistance: "",
    email: ""

});


var Weight = mongoose.model("Weight", weightSchema);
var User = mongoose.model("User", userSchema);
var Nutrients = mongoose.model("Nutrients", nutrientsSchema);
var Cals = mongoose.model("Cals", calsSchema);

var express = require('express');
var router = express.Router();


router.post('/signup', function (req, res) {
    user = req.body;
    bcrypt.hash(user.password, 8, function(err, hash) {
        if(err) {
            return res.json({Error:"Unable to signup"});
        }
        user.password = hash;
        let myData = new User(user);
        myData.save().then(item => {
            console.log(item);
            res.send("item was saved");
        }).catch(err => {
            res.json({Error:"unable to send to the database"});
        });
    });

});

router.post('/login', function(req, res) {
    User.findOne(req.body, function (err, user) {
        if(err) {
            res.json({"Error": "User not found"});
        }
        bcrypt.compare(user.password, hash, function(err, isValidPassword) {
            if(isValidPassword) {
                return res.json({"userEmail":user.email});
            }
            return res.json({Error: "Unable to sign in"})
        });
        }
    );
});


router.post('/addWeight', function (req, res) {
    weight = req.body;
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    weight.date = month + '/' + day + '/' + year;
    let myWeight = new Weight(weight);
    myWeight.save().then(item => {
        res.json({Success:"Weight Added"});
    });
    res.json({Error: "Unable to add weight"})
});

router.get('/getWeightForToday', function (req, res) {
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    Weight.findOne(req.body, function (err, result) {
        if(err) {
            return res.json({Error:"Could not find proper date"});
        }
        return res.json(result);
    });
});

router.get('/getCals',function (req, res) {
    Cals.findOne(req.body, function (err, calResult) {
        if(err) {
            return res.json({Error:"Could not find proper date"});
        }
        return res.json(calResult);
    });
});

router.get('/getNutrients',function (req, res) {
    Cals.findOne(req.body, function (err, nutrientResults) {
        if(err) {
            return res.json({Error:"Could not find proper date"});
        }
        return res.json(nutrientResults);
    });
});

module.exports = router;

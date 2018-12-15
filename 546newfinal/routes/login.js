const express = require('express');
const router = express.Router();
const flash = require('connect-flash');
const bcrypt = require('bcrypt-nodejs');

const dbOperation = require("../data/users");

router.get("/login", (req, res) => {
    if (req.cookies.AuthCookie || req.session.user) {
        res.redirect('/home');
    }
    else {
        res.render('main/login');
    }
});

router.post("/login", async (req, res) => {

    if (!req.body.email_login) {

        res.render("main/login", {error: "email cannot be empty"});
        return;
    }

    if (!req.body.password_login) {
     
        res.render("main/login", {error: "PASSWORD CANNOT BE EMPTY"});
        return;
    }

    const userObj = await dbOperation.getUser(req.body.email_login);

    if (!userObj) {
        res.render("main/login", {error: "Email Address not valid"});
        return;
    }

    console.log(userObj.password_login);
    console.log(req.body.password_login);

    console.log(userObj);

    const passwordMatches = await bcrypt.compareSync(req.body.password_login, userObj.password);

    if (!passwordMatches) {
        console.log("wrong password");
        res.render("main/login", {error: "Password is not correct"});
        return;
    } else {
        console.log("login successfully");
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);
        res.cookie("AuthCookie",userObj._id,{ expires: expiresAt });
        req.session.user = userObj;
        res.redirect('/home');
    }


});

module.exports = router;




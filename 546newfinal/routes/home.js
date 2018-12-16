const express = require("express");
const router = express.Router();

const dbOperation = require("../data/users");
const recordsData = require("../data/rec");

var multer  = require('multer')
// var upload = multer({ dest: 'uploads/' })

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname + '-' + Date.now());
    }
  })
  
  var upload = multer({ storage: storage })

router.get("/home", async (req, res) => {
    try{
       
        res.render("main/home");
    } catch (e) {
        res.status(500).send();
    }

});

router.get("/home/account", async(req, res) => {
    try {
    const id = req.cookies.AuthCookie;
    const user = await dbOperation.getUserById(id);
    let firstName = user.firstname;
    let lastName = user.lastname;
    let email = user.email;
    let birthDate = user.dataofbirth;
    let gender = user.gender;
    res.render("main/account", {firstName, lastName, email, birthDate, gender})
    } catch (e) {
        res.status(500).send();
    }
})

router.get("/home/account/update", async (req, res) => {
    try {
        const id = req.cookies.AuthCookie;
        const user = await dbOperation.getUserById(id);
        let firstName = user.firstname;
        let lastName = user.lastname;
        let email = user.email;
        let birthDate = user.dataofbirth;
        let gender = user.gender;
        res.render("main/accountUpdate", {firstName, lastName, email, birthDate, gender})
        } catch (e) {
            res.status(500).send();
        }
})

router.post("/home/account/update", async (req, res) => {
    try{
        const id = req.cookies.AuthCookie;
        let userNew = req.body;
        let firstName = userNew.firstname;
        let lastName = userNew.lastname;
        let email = userNew.email;
        let birthDate = userNew.dateofbirth;
        let gender = userNew.gender;
        let updateItem = await dbOperation.updateUserById(id, firstName, lastName, email, birthDate, gender);
        console.log("update item: ", updateItem);
        res.redirect("/home/account");
    } catch (e) {
        res.status(500).send();
    }
})

router.get("/home/upload", async (req, res) => {
    res.render("main/upload");
})

router.post("/home/upload",upload.single('resume'), async (req,res)=>{
        let companyName = req.body.companyName;
        let position = req.body.position;
        let jobDescription = req.body.jobDescription;
        let jobStatus = req.body.jobStatus;
        let comments = req.body.comments; 
        await recordsData.createRec(req.cookies.AuthCookie, companyName, position, jobDescription, jobStatus, comments);
        res.send("upload sussessful");
})

module.exports = router;
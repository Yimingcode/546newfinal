const express = require("express");
const router = express.Router();




router.get("/home", async (req, res) => {
    try{
       
        res.render("main/home");
    } catch (e) {
        res.status(500).send();
    }

});

module.exports = router;
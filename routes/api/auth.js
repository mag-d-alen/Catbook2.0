 const express = require('express');
 const router = express.Router();


//route GET to endpoint api/auth
//description: test route
//access value: public
 router.get("/", (req,res)=>{
     res.send("auth route");
 })

 module.exports = router;
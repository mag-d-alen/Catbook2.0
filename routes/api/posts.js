 const express = require('express');
 const router = express.Router();


//route GET to endpoint api/posts
//description: test route
//access value: public
 router.get("/", (req,res)=>{
     res.send("posts route");
 })

 module.exports = router;
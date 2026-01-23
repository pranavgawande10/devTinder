 const jwt  = require("jsonwebtoken");
const User = require("../models/user");

 const userAuth = async (req,res,next)=>{
    try 
    {
        //read the token fron req cookies
        //validate the token 
        //find the user
        const {token } = req.cookies;
        if(!token)
        {
          return res.status(401).send("please login!!");
        }

        const decodeddata = await jwt.verify(token , "dev@tinder");

        const { _id} = decodeddata;
        const user = await User.findById(_id);
        // console.log(user);
      
        if(!user)
        {
            throw new Error("User not found!!!");
        }
    
        req.user = user;
         next();  
    
    }
    catch(error)
    {
         res.status(400).send("Error : " + error );
    }
 }

 module.exports = { userAuth };



// const userauth = (req,res,next)=>{
//     const auth = "abc";
//     const isauth = auth === "abc";

//     if(!isauth)
//     {
//         res.status(401).send("unauthorized request!");
//     }
//     else{
//      next();
//     }
// };
// const adminauth = (req,res,next)=>{
//     const auth = "xyzz";
//     const isauth = auth === "xyz";

//     if(!isauth)
//     {
//         res.status(401).send("unauthorized request!");
//     }
//     else{
//      next();
//     }
// };

// module.exports = {userauth, adminauth};
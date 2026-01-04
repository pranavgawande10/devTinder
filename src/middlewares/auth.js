const userauth = (req,res,next)=>{
    const auth = "abc";
    const isauth = auth === "abc";

    if(!isauth)
    {
        res.status(401).send("unauthorized request!");
    }
    else{
     next();
    }
};
const adminauth = (req,res,next)=>{
    const auth = "xyzz";
    const isauth = auth === "xyz";

    if(!isauth)
    {
        res.status(401).send("unauthorized request!");
    }
    else{
     next();
    }
};

module.exports = {userauth, adminauth};
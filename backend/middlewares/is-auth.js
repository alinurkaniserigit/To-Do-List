const { json } = require("express");
const jwt= require("jsonwebtoken");
const loginToken = require("../models/login-token");
require('dotenv').config();

const publicPaths = ["/graphql/login", "/graphql/register","/graphql/confirmation","/graphql/activateAccount","/graphql/removeUser","/graphql/addUserToBlockList"]

const checkPublicPath =(path, token)=>{
    return publicPaths.some(endpoint=>endpoint === path || 
        token ==='Bearer login' || 
        path.substring(0,path.lastIndexOf('/')) === "/graphql/activate-account" ||
        path.substring(0,path.lastIndexOf('/')) === "/graphql/delete-account")
}

module.exports = (req,res,next)=>{
    const authHeader = req.get('Authorization') || req.get('authorization');

    //if request url is login or register don't ask for authorization
    if(checkPublicPath(req.originalUrl, authHeader)){
        return next()
    }
    
    //if there isn't authheader return error
    if(!authHeader){
        req.isAuth = false;
        res.json({
            message:'Unauthenticated',
        })
        res.status(401);
        return res;
    }

    //if there is, it will be like Bearer *****, we will get the ***** part
    const token = authHeader.split(' ')[1];

    //If there isn't a token return error
    if(!token || token === ''){
        req.isAuth = false;
        res.json({
            message:'Unauthenticated',
        })
        res.status(401);
        return res ;
    }

    //verify the token
    let decodedToken;
    try{
        decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    }
    catch(err){
        req.isAuth = false;
        res.json({
            message:'Unauthenticated',
        })
        res.status(401);
        return res;
    }
    if (!decodedToken){
        req.isAuth = false;
        res.json({
            message:'Unauthenticated',
        })
        res.status(401);
        return res;
    }

    //give variables to the request object
    req.isAuth = true;
    req.email = decodedToken.email;
    req.userID = decodedToken.userID;
    req.name = decodedToken.name;
    req.groupNames = decodedToken.groupNames;
    req.listNames = decodedToken.listNames;
    req.isAdmin = decodedToken.isAdmin;
    
    //req.isAdmin = decodedToken.isAdmin;
    return next();
}
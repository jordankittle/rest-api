const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const { User }  = require('../models');

// Middleware to authenticate the request using Basic Authentication
exports.authenticateUser = async (req, res, next) => {
    let message;
    const credentials = auth(req);
    if(credentials){
        const user = await User.findOne({
            where: {
                emailAddress: credentials.name
            }
        });
        if(user){
            const authenticated = bcrypt.compareSync(credentials.pass, user.password);
            if(authenticated){
                console.log(`Authentication successful for username: ${user.emailAddress}`);
                req.currentUser = user;
            } else {
                message = `Authnetication failed for username: ${user.emailAddress}`;
            }
        } else {
            message = `Username: ${credentials.name} not found`;
        }

    } else {
        message = `Authentication header not found`;
    }
    
    if(message){
        console.warn(message);
        res.status(401).json({Message: 'Access Denied'});
    } else {
        next()
    }
};
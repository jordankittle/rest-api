const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/asyncHandler');
const { User } = require('../models');
const { authenticateUser } = require('../middleware/authenticateUser');


router.get('/', (req, res) =>  {
    res.json({
        message: "Welcome to the api route"
    });
});

// Return authenticated user
router.get('/users', authenticateUser, asyncHandler( async (req, res) => {
    const user = await User.findByPk(req.currentUser.id);
    res.json({user});
}));

// Create a new user
router.post('/users', asyncHandler( async (req, res) => {
    let user;
    try{
        user = await User.create(req.body);
        res.location('/').status(201).end();    
    } catch(error) {
        if(error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors }); 
        } else {
            console.log('got to else');
            res.status(500).json({message: "An error has occured. User has not been saved"});
        }
    }
}));

module.exports = router;
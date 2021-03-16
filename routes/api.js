const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/asyncHandler');
const { User, Course } = require('../models');
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
router.post('/users', asyncHandler( async (req, res, next) => {
    let user;
    try{
        user = await User.create(req.body);
        res.location('/').status(201).end();    
    } catch(error) {
         next(error);
    }
}));

// Show all courses 
router.get('/courses', asyncHandler( async (req, res) => {
    const courses = await Course.findAll({
        include: [
            {
                model: User,
            },
        ],
      });
    res.json({courses});
}));

// Show individual course by ID
router.get('/courses/:id', asyncHandler( async (req, res, next) => {
    const course = await Course.findByPk(req.params.id, {
        include: [
            {
                model: User,
            }
        ],
    });
    if(course){
        res.json({course});
    } else {
        const error = new Error(`Course ID:${req.params.id} not found`);
        error.status = 404;
        next(error);

    }
}));

// Create a new course
router.post('/courses', authenticateUser, asyncHandler( async (req, res, next) => {
    const user = await User.findByPk(req.currentUser.id);
    if(user){
        try{
            if(req.body.userId === user.id){
                const course = await Course.create(req.body);
                res.location('/courses/' + course.id).status(201).end();
            } else {
                res.status(400).json({message: "Owner of the course must be the authenticated user"});
            }  
        }
        catch(error) {
            next(error);
        }
    } else {
        res.json({message: "No user found"});
    } 
}));

module.exports = router;
const express = require('express');
const router = express.Router();
const { User, Course } = require('../models');
const { asyncHandler } = require('../middleware/asyncHandler');
const { validateCourse } = require('../middleware/validate');
const { authenticateUser } = require('../middleware/authenticateUser');


router.get('/', (req, res) =>  {
    res.json({
        message: "Welcome to the api route"
    });
});

// Return authenticated user
router.get('/users', authenticateUser, asyncHandler( async (req, res) => {
    const attributes = ['id', 'firstName', 'lastName', 'emailAddress'];
    const user = await User.findByPk(req.currentUser.id, {attributes});
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
    const attributes = ['title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'];
    const userAttributes = ['id', 'firstName', 'lastName', 'emailAddress'];
    const courses = await Course.findAll({
        include: [
            {
                model: User,
                attributes: userAttributes,
            },
        ],
        attributes,
      });
    res.json({courses});
}));

// Show individual course by ID
router.get('/courses/:id', asyncHandler( async (req, res, next) => {
    const attributes = ['title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'];
    const userAttributes = ['id', 'firstName', 'lastName', 'emailAddress'];
    const course = await Course.findByPk(req.params.id, {
        include: [
            {
                model: User,
                attributes: userAttributes,
            }
        ],
        attributes,
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
router.post('/courses', authenticateUser, validateCourse, asyncHandler( async (req, res, next) => {
    const user = await User.findByPk(req.currentUser.id);
    if(user){
        try{
            if(req.body.userId === user.id){
                const course = await Course.create(req.body);
                res.location('/courses/' + course.id).status(201).end();
            } else {
                const error = new Error('Owner of the course must be the authenticated user');
                error.status = 400;
                throw error;            }  
        }
        catch(error) {
            next(error);
        }
    } else {
        const error = new Error('User not authenticated');
        error.status = 400;
        throw error;
    } 
}));

// Update a course
router.put('/courses/:id', authenticateUser, validateCourse, asyncHandler( async (req, res, next) => {
    const user = await User.findByPk(req.currentUser.id);
    if(user){
        try{
            if(+req.params.id === user.id && req.body.userId == user.id){
                const course = await Course.findByPk(req.params.id);
                if(course){
                    await course.update(req.body);
                    res.status(204).end();
                } else {
                    const error = new Error(`Course ID:${req.params.id} not found`);
                    error.status = 400;
                    throw error;  
                }
            } else {
                const error = new Error('Owner of the course must be the authenticated user');
                error.status = 403;
                throw error;
            }  
        }
        catch(error) {
            next(error);
        }
    } else {
        const error = new Error('User not authenticated');
        error.status = 400;
        throw error;
    }     
}));

// Delete a course
router.delete('/courses/:id', authenticateUser, asyncHandler( async (req, res, next) => {
    const user = await User.findByPk(req.currentUser.id);
    if(user){
        try{
            if(+req.params.id === user.id){
                const course = await Course.findByPk(req.params.id);
                if(course){
                    await course.destroy();
                    res.status(204).end();
                } else {
                    const error = new Error(`Course ID:${req.params.id} not found`);
                    error.status = 400;
                    throw error;  
                }
            } else {
                const error = new Error('Owner of the course must be the authenticated user');
                error.status = 403;
                throw error;
            }  
        }
        catch(error) {
            next(error);
        }
    } else {
        const error = new Error('User not authenticated');
        error.status = 400;
        throw error;
    }     
}));

module.exports = router;
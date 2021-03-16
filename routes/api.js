const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/asyncHandler');
const { User } = require('../models');


router.get('/', (req, res) =>  {
    res.json({
        message: "Welcome to the api route"
    });
});

router.get('/users', asyncHandler( async (req, res) => {
    const users = await User.findAll();
    res.json({users});
}));

module.exports = router;
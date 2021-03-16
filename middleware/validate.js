exports.validateCourse = async (req, res, next) => {
    let errors = [];
    if(!req.body.title){
        errors.push('Course title required');
    }
    if(!req.body.description){
        errors.push('Course description required');
    }
    if(errors.length > 0){
        res.status(400).json({errors});
    } else {
        next();
    }

};
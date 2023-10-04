//Validating the Request Body

const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
    //calling validationResult to validate request
    const validationErrors = validationResult(req);
    // if there are validation errors, create an error with all error message
    if (!validationErrors.isEmpty()) {
        const errors = {};
        validationErrors
            .array()
            .forEach(error => errors[error.path] = error.msg);

        const err = Error("Bad Request");
        err.errors = errors;
        err.status = 400;
        err.title = "Bad Request";
        next(err);
    }
    // if no error, invoke the next error-handling middleware
    next();
};

module.exports = {
    handleValidationErrors
};

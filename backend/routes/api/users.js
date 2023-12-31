const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

//Validating Signup Request Body
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Invalid email'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4})
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('username')
        .exists({ checkFalsy: true})
        .withMessage('Username is required'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    check('firstName')
        .exists({ checkFalsy: true})
        .withMessage('First Name is required'),
    check('lastName')
        .exists({ checkFalsy: true})
        .withMessage('Last Name is required'),

    handleValidationErrors
];

router.post('/', validateSignup, async(req, res) => {
    const { email, password, username, firstName, lastName } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({
        email,
        firstName,
        lastName,
        username,
        hashedPassword
    });

    const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username
    };

    await setTokenCookie(res, safeUser);

    return res.json({
        user: safeUser
    })
})

/*
fetch('/api/users', {
    method: 'POST',
    headers: {
        "Content-Type": "application/json",
        "XSRF-TOKEN": "xnDrAJzu-XPqrhuTynBZ8M1-hl0-Y7hN0jio"
    },
    body: JSON.stringify({
       firstName: 'Spider',
       lastName: 'Man',
       email: 'spidey@spider.man',
       username: 'Spidey',
       password: 'password'
    })
}).then(res => res.json()).then(data => console.log(data));
*/

module.exports = router;

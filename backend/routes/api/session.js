const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models')

//Validating Login Request Body
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation')

const validateLogin = [
    check('credential')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Email or username is required'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Password is required'),
    handleValidationErrors
]

router.post('/', validateLogin, async(req, res, next) => {
    const { credential, password } = req.body;
    const user = await User.unscoped().findOne({
        where: {
            [Op.or]: {
                username: credential,
                email: credential
            }
        }
    });

    if(!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
        const err = new Error('Login Failed')
        err.status = 401
        err.title = 'Login failed'
        err.errors = { credential: 'The provided credentials were invalid.'}
        return next(err)
    }

    const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
    };

    await setTokenCookie(res, safeUser);

    return res.json({
        user: safeUser
    });
});

router.delete('/', (_req, res) => {
    res.clearCookie('token');
    return res.json( {message: 'success'} )
});

router.get('/', (req, res) => {
    const { user } = req;
    if (user) {
        const safeUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
        };
        return res.json({
            user: safeUser
        });
    }else  return res.json({ user: null })
});

/*

fetch('/api/session', {
    method: 'POST',
    headers: {
        "Content-Type": "application/json",
        "XSRF-TOKEN": "U5mFkn6f-s133ayTtOotGAw6YMSQq8sf_PkA"
    },
    body: JSON.stringify({ credential: 'demo@user.io', password: 'password' })
}).then(res => res.json()).then(data => console.log(data));


fetch('/api/session', {
    method: 'DELETE',
    headers: {
         "Content-Type": "application/json",
        "XSRF-TOKEN": "U5mFkn6f-s133ayTtOotGAw6YMSQq8sf_PkA"
    }
}).then(res => res.json()).then(data => console.log(data));
*/


module.exports = router;

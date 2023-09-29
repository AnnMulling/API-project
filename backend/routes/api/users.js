const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

router.post('/', async(req, res) => {
    const { email, password, username } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({
        email,
        username,
        hashedPassword
    });

    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.name
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
        "XSRF-TOKEN": "zwi6OQQh-gDxaBMXRY-ZEhw4JUvKmaZUFxZk"
    },
    body: JSON.stringify({
        email: "spidey@spider.man",
        username: "Spidey",
        password: "password"
    })
}).then(res => res.json()).then(data => console.log(data))
*/

module.exports = router;

const express = require('express');
const router = express.Router();
const { Op } = require("sequelize");
const { requireAuth, isOwner } = require('../../utils/auth');
const { SpotImage} = require('../../db/models');
const { matchSpot, matchReview, matchUserSpot } = require('../../utils/validation-match');

router.delete('/:imageId', [ requireAuth, matchUserSpot ], async (req, res) => {
    const { imageId } = req.params;
    const image = await SpotImage.findByPk(imageId);

    if (!image) {
        res.status(404);
        res.json({
            "message": "Spot Image couldn't be found"
          })
    }

    await image.destroy();

    res.json({

            "message": "Successfully deleted"

    })
});






module.exports = router;

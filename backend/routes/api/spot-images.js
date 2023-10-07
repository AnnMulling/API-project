const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { SpotImage, Spot } = require('../../db/models');


router.delete('/:imageId', [ requireAuth ], async (req, res) => {
    const { user } = req;
    const { imageId } = req.params;
    const spotImage = await SpotImage.findByPk(imageId);

    if (!spotImage) {
        res.status(404);
        res.json({
            "message": "Spot Image couldn't be found"
          })
    }

    if (spotImage.spotId) {
        const spot = await Spot.findByPk(spotImage.spotId);
        
            if (spot.ownerId !== user.id) {
                res.status(403);
                return res.json("Unauthorized Activity")
            }
    }


    await spotImage.destroy();

    res.json({

            "message": "Successfully deleted"

    })
});






module.exports = router;

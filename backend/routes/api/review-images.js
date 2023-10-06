const express = require('express');
const router = express.Router();
const { Op } = require("sequelize");
const { requireAuth, isreviewWriter } = require('../../utils/auth');
const { ReviewImage, Review } = require('../../db/models');



router.delete('/:imageId',  requireAuth, async(req, res) => {
        const { user } = req;
        
        const { imageId } = req.params;
        const imageReview = await ReviewImage.findByPk(imageId);

        if (!imageReview) {
            res.status(404)
            res.json({

                    message: "Review Image couldn't be found"

            })
        }

        await imageReview.destroy();
        res.json({

                message: "Successfully deleted"

        });
});



module.exports = router;

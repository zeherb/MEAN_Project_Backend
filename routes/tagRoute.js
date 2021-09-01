const express = require('express');
const router = express.Router();
const Tag = require('../models/tagSchema');

//  add new tag
router.post('/tags', async (req, res) => {
    try {
        const tagData = req.body
        if (!("name" in tagData && "description" in tagData)) {
            res.status(400).json({ message: "Empty Field !" })
        } else {
            const foundTag = await Tag.findOne({ name: tagData.name })
            if (foundTag) {
                res.status(400).json({ message: "this tag already exists" })
            } else {
                const newTag = await Tag.create(tagData)
                res.status(200).json({ message: "tag created successfully" })
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
})

// update tag
router.put('/tags/:id', async (req, res) => {
    try {
        const updatedTag = await Tag.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: "Tag updated successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
})

// delete tag 
router.delete('/tags/:id', async (req, res) => {
    try {
        const deletedTag = await Tag.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Tag deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
});


module.exports = router;

const { success, error } = require('../helpers/api-response');
const {Item} = require('../models/item');


// @route GET/
// @desc get by name or alternate name.
// @access Private

const getItemsByNameOrAlternateName = async (req, res, next) => {
   
    const { value } = req.params;
    const items = await Item.find({
        $or: [
            {
                name: {
                    $regex: value + '.*',
                    $options: 'i',
                },
            },
            {
                alternateName: {
                    $regex: value + '.*',
                    $options: 'i',
                },
            },
           
        ],
        active: 1
    },
    {   
        id: 1,
        name: 1,
      
    }).sort({
        name: 1,
    });

    res.status(200).json(
        success(
            'Items list',
            {
                items,
            },
            res.statusCode,
        ),
    );
};

module.exports = {
    getItemsByNameOrAlternateName
};
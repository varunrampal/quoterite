const { success, error } = require('../helpers/api-response');
const { Property } = require('../models/property');
const { User } = require('../models/user');

const getProperties = async (req, res, next) => {
    const { custemail } = req.body;

    //check if user exists with userid
    const user = await User.find({
        email: custemail,
    });

    if (!user) {
        return res
            .status(400)
            .json(error('Invalid user details.', res.statusCode));
    }

    await Property.find({
        custEmail: custemail,
    })
        .sort({
            name: 1,
        })
        .then((docs) => {
            res.status(200).json(
                success(
                    'Customer Properties',
                    {
                        totalRecords: docs.length,
                        properties: docs,
                    },
                    res.statusCode,
                ),
            );
        });
};

module.exports = {
    getProperties,
};

const express = require('express');
const { join } = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { json, urlencoded } = express;
//const kue = require('kue');
const HttpError = require('../helpers/http-error');

const error = require('../middleware/error');

// import routes
const usersRoutes = require('../routes/users-routes');
// const receiptRoutes = require('../routes/receipt-routes');
// const s3routes = require('../routes/s3-routes');
const propertyRoutes = require('../routes/property-routes');
const itemRoutes = require('../routes/item-routes');
const quoteRoutes = require('../routes/quote-routes');
const adminDashboardRoutes = require('../routes/admin-dashboard-routes');
const customerDashboardRoutes = require('../routes/customer-dashboard-routes');

module.exports = function (app) {
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.use(json());
    app.use(
        urlencoded({
            extended: false,
        }),
    );
    app.use(cookieParser());

    app.use(cors());

    // routes declaration
    app.use('/api/user', usersRoutes); // => /api/user...
    // app.use('/api/receipt', receiptRoutes); // => /api/receipt...
    // app.use('/api/sign_s3', s3routes); // => /api/sign_s3
    app.use('/api/customer', propertyRoutes); // => /api/customer/properties...
    app.use('/api/item', itemRoutes);
    app.use('/api/quote', quoteRoutes);
    app.use('/api/admin', adminDashboardRoutes);
    app.use('/api/customer', customerDashboardRoutes);
    // app.use('/kue-api/', kue.app);
  
    app.use(error);
};

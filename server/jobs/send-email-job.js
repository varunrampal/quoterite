const sgMail = require('@sendgrid/mail');
const kue = require('kue');
const queue = kue.createQueue();
const mongoose = require('mongoose');
const winston = require('winston');

const {
    appEnums
} = require('../helpers/app-enums');

const createEmailJob = async (job) => {
    try {
        // create and save a job
        queue.create('Send Receipt Email', job).save();

        //email job created 
        winston.info(`Email job created, User: ${job.to}, date: ${new Date()}`);

        return appEnums.Email.SENT;
    } catch (ex) {
        winston.info(`Error in creating email job, User: ${job.to}, date: ${new Date()}, error: ${ex}`);;
    }
};

//process job added to the queue - its a worker
queue.process('Send Receipt Email', (job, DoneCallback) => {
    try {
        const {
            msg
        } = job.data;
        //setup API key
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        //Send mail
        sgMail.send(msg).then((result) => {
         
           //email sent
           winston.info(`Email sent, User: ${msg.to}, date: ${new Date()}`);
            DoneCallback();
            //return result;
        }).catch((error) => DoneCallback(error));

    } catch (ex) {
        winston.info(`Error in sending email, User: ${msg.to}, date: ${new Date()}, error: ${ex}`);
    }
});

module.exports = {
    createEmailJob,
};
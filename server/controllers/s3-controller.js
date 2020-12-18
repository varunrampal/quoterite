var aws = require('aws-sdk');
const winston = require('winston');

require('dotenv').config({
    path: `.env.${process.env.NODE_ENV}.local`,
});
// console.log(process.env.Bucket);

aws.config.update({
    region: 'us-east-1',
    accessKeyId: process.env.AWSAccessKeyId,
    secretAccessKey: process.env.AWSSecretKey,
});

const S3_BUCKET = process.env.Bucket;

const sign_s3 = (req, res) => {

    s3ApiCall(req.body, function(response){
            
      res.json(response.data);
       
     })
};

const s3ApiCall = (data,callback) => {
   
    try {
        const s3 = new aws.S3();
      
        const { fileName, fileType, userId } = data;
        const folderName = fileType === 'csv' ? 'csv' : 'pictures';
        const path = `${folderName}/${userId}/${fileName}`;

        const s3Params = {
            Bucket: S3_BUCKET,
            Key: path,
            Expires: 500,
            ContentType: fileType,
            ACL: 'public-read',
        };

          if(fileType === 'csv') {
           delete s3Params.ContentType;
           s3Params.ContentDisposition = 'attachment';

          }
        // Make a request to the S3 API to get a signed URL which we can use to upload our file
        doCallS3(s3, s3Params, data, function(response){
          
            winston.info(
                `Response after file upload on S3, Url: ${response.data.url}, User: ${userId}, date: ${new Date()}`
            );
           return callback(response);
          
        })
    } catch (e) {
       
    }
};

function doCallS3(s3, s3Params, data, callback) {

    const { fileType, userId } = data;

    const result = {
        success: false,
        data: null,
    };

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if (err) {
            winston.info(
                `Error in file uploaded on S3, File-Type: ${fileType} User: ${userId}, date: ${new Date()}`
            );
            return callback(result);
        }
        // Data payload of what we are sending back, the url of the signedRequest and a URL where we can access the content after its saved.
        const returnData = {
            signedRequest: data,
            url: `https://${S3_BUCKET}.s3.amazonaws.com/${s3Params.Key}`,
        };

        winston.info(
            `File uploaded on S3, File-Type: ${fileType} User: ${userId}, date: ${new Date()}`
        );

        result.success = true;
        result.data = returnData;

        return callback(result);
    });
}

module.exports = {
    sign_s3,
    s3ApiCall,
};

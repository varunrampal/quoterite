const request = require('supertest');
const { Receipt } = require('../../models/receipt');
const { User } = require('../../models/user');
const mongoose = require('mongoose');

let server;
let user;
let token;

describe('/api/receipt', () => {
    beforeEach(async () => {
        server = require('../../app');
        // create test user
        user = await new User().generateAuthToken();

        token = user.token;
    });
    afterEach(async () => {
        server.close();
        await Receipt.deleteOne({});
        await User.deleteOne({});
    });

    // GET receipt by id test cases
    describe('GET /receipt/:id', () => {
        let receipt;
        let id;

        //create aoi requet
        const exec = async () => {
            return await request(server)
                .get('/api/receipt/' + id)
                .set('Authorization', 'Bearer ' + token)
                .send();
        };

        beforeEach(async () => {
            // create a new receipt and save receipt in database
            receipt = new Receipt({
                title: 'receipt100',
                amount: 100,
                category: 'testCategory',
                user: user.userId,
            });

            await receipt.save();
            id = receipt._id;
        });

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return a receipt if valid id is passed', async () => {
            // execute api request
            const res = await exec();

            // check response returned
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('title', receipt.title);
        });

        it('should return 404 if no reeipt with the given id exists', async () => {
            id = mongoose.Types.ObjectId();

            const res = await exec();

            expect(res.status).toBe(404);
        });
    });

    //POST receipt test cases
    describe('POST /receipt/', () => {
        let receipt;

        //create aoi requet
        const exec = async () => {
            return await request(server)
                .post('/api/receipt/')
                .set('Authorization', 'Bearer ' + token)
                .send(receipt);
        };

        beforeEach(() => {
            receipt = new Receipt({
                title: 'receipt101',
                amount: 100,
                category: 'testCategory',
                user: user.userId,
            });
        });

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should save the receipt if it is valid', async () => {
            await exec();

            const receipt = await Receipt.find({
                title: 'receipt101',
            });

            expect(receipt).not.toBeNull();
        });
    });

});

const express = require('express');
const cors = require('cors');

// setting up firebase functions
const admin = require('firebase-admin');
const functions = require('firebase-functions');

const uuidv5 = require('uuid/v5');
const uuidv4 = require('uuid/v4');

admin.initializeApp();

const app = express();
app.use(cors());

app.post('/', async (request, response) => {
    const userData = request.body || {};

    const { firstName, lastName, birthday, age, hobby } = userData;

    try {
        await admin
            .database()
            .ref('/users')
            .push({ firstName, lastName, birthday, age, hobby });

        return response.status(200).json({
            message: 'User information successfully saved',
            data: userData
        });
    } catch (error) {
        console.log(error);
        return response.status(400).send('Unable to add the user');
    }
});

exports.users = functions.https.onRequest(app);

exports.updateUserID = functions.database.ref('/users/{userID}').onCreate((snapshot) => {
    const MY_NAMESPACE = uuidv4();
    const randomUserID = uuidv5('https://enye.tech', MY_NAMESPACE); // generate random user id

    // a promise most be return when performing asynchronous request like saving something in the real-time database
    return snapshot.ref.child('userID').set(randomUserID);
});

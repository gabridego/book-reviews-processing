'use strict';

const express = require('express');

const resultsDao = require('./results_dao');

const kafka = require('./kafka');

const morgan = require('morgan'); // logging middleware

//const PORT = process.env.SERVER_PORT;
const PORT = 3001;

const app = express();

// Set-up logging
app.use(morgan('tiny'));

/*
// default options
const fileUpload = require('express-fileupload');
app.use(fileUpload());

app.post('/api/documents/upload', function(req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let sampleFile = req.files.sampleFile; //The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    
    //kafka.sendSpark(sampleFile.data);

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv('./files/' + req.files.sampleFile.name, function(err) {
        if (err)
            //return res.status(500).send(err);
            return res.status(500).json(err);

        res.status(201).send('File uploaded!');
    });
});
*/



app.use(express.json()); //used in order to parse the the body request as json (useful for insert with post)

//REST API

app.get('/api/ping', (req, res) => { //used for health check
    res.status(200).send('pong');
});

app.get('/api/results/wordcount', (req, res) => {
    resultsDao.getWordCount()
    .then((result) => {
        res.json(result);
    })
    .catch((err) => {
        res.status(500).json(err);
    });
});

app.get('/api/results/sentiment', (req, res) => {
    resultsDao.getSentiment()
    .then((result) => {
        res.json(result);
    })
    .catch((err) => {
        res.status(500).json(err);
    });
});

app.get('/api/results/sentiment/accuracy', (req, res) => {
    resultsDao.getSentimentAccuracy()
    .then((result) => {
        res.json(result);
    })
    .catch((err) => {
        res.status(500).json(err);
    });
});

app.post('/api/documents/text', (req, res) => {
    const data = req.body;
    kafka.sendSpark(data);
    res.status(201).end();
});

//start server
app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));
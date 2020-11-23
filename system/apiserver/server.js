'use strict';

const express = require('express');

const resultsDao = require('./results_dao');

const morgan = require('morgan'); // logging middleware

const fileUpload = require('express-fileupload');

const PORT = process.env.SERVER_PORT;

const app = express();

// Set-up logging
app.use(morgan('tiny'));




// default options
app.use(fileUpload());

app.post('/api/training/documents/upload', function(req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    
    let sampleFile = req.files.sampleFile; //The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv('./files/' + req.files.sampleFile.name, function(err) {
        if (err)
            //return res.status(500).send(err);
            return res.status(500).json(err);

        res.status(201).send('File uploaded!');
    });
});




app.use(express.json()); //used in order to parse the the body request as json (useful for insert with post)

//REST API

app.get('/api/results/wordcount', (req, res) => {
    //const result = [{value: 'told', count: 64}, {value: 'house', count: 25},];
    //res.json(result);

    resultsDao.getWordCount()
    .then((result) => {
        res.json(result);
    })
    .catch((err) => {
        res.status(500).json(err);
    });
});

app.get('/api/results/sentiment', (req, res) => {

    //const result = [{id: 1, review: "nice", result: "positive", expected: "positive"}, {id: 2, review: "cool", result: "negative", expected: "positive"}];
    //res.json(result);

    resultsDao.getSentiment()
    .then((result) => {
        res.json(result);
    })
    .catch((err) => {
        res.status(500).json(err);
    });
});

app.get('/api/results/sentiment/accuracy', (req, res) => {
    //const result = [{id: 1, value: 0},{id: 2, value: 50},{id: 3, value: 66.6},{id: 4, value: 50}]
    //res.json(result);

    resultsDao.getSentimentAccuracy()
    .then((result) => {
        res.json(result);
    })
    .catch((err) => {
        res.status(500).json(err);
    });
});

app.post('/api/training/documents/text', (req, res) => {
    const data = req.body;
    console.log(data);
    res.status(201).json({"id" : 1});

    /*if(!data){
        res.status(400).end();
    
    } else {
        resultsDao.insertTrainingDocuments(data)
            .then((id) => res.status(201).json({"id" : id}))
            .catch((err) => { res.status(500).json(err) });
    }*/
});

app.post('/api/test/documents/text', (req, res) => {
    const data = req.body;
    console.log(data);
    res.status(201).json({"id" : 1});

    /*if(!data){
        res.status(400).end();
    } else {
        resultsDao.insertTestDocuments(data)
            .then((id) => res.status(201).json({"id" : id}))
            .catch((err) => { res.status(500).json(err) });
    }*/
});

app.delete('/api/results', (req, res) => {
    res.status(204).end();

    /*rentalDao.deleteResults()
        .then(() => res.status(204).end())
        .catch((err) => res.status(500).json(err));*/
});

//start server
app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));
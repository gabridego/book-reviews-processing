'use strict';

const express = require('express');

const resultsDao = require('./results_dao');

const morgan = require('morgan'); // logging middleware

const PORT = process.env.SERVER_PORT;

const app = express();

// Set-up logging
app.use(morgan('tiny'));

app.use(express.json()); //used in order to parse the the body request as json (useful for insert with post)



//REST API

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

app.post('/api/training/documents', (req, res) => {
    const data = req.body;

    if(!data){
        res.status(400).end();
    } else {
        resultsDao.insertTrainingDocuments(data)
            .then((id) => res.status(201).json({"id" : id}))
            .catch((err) => { res.status(500).json(err) });
    }
});

app.post('/api/test/documents', (req, res) => {
    const data = req.body;

    if(!data){
        res.status(400).end();
    } else {
        resultsDao.insertTestDocuments(data)
            .then((id) => res.status(201).json({"id" : id}))
            .catch((err) => { res.status(500).json(err) });
    }
});

app.delete('/api/results', (req, res) => {
    rentalDao.deleteResults()
        .then(() => res.status(204).end())
        .catch((err) => res.status(500).json(err));
});

//start server
app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));
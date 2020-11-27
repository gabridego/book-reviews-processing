'use strict'

const MongoClient = require('mongodb').MongoClient;

const uri = process.env.DATABASE_CONNECTIONSTRING;

const dbname = "sdtddb";

module.exports = { MongoClient, uri, dbname };
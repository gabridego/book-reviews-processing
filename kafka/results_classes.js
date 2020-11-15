'use strict';

class wordcount{
    constructor(id, word, counter) {
        if(id)
            this.id = id;

        this.word = word;
        this.counter = counter;
    }
}

class sentiment{
    constructor(id, document_id, returned_result, expected_result) {
        if(id)
            this.id = id;

        this.document_id = document_id;
        this.returned_result = returned_result;
        this.expected_result = expected_result;
    }
}

class document{
    constructor(id, text) {
        if(id)
            this.id = id;

        this.text = text;
    }
}


module.exports = {wordcount, sentiment, document};
async function getWordCount() {
    const response = await fetch("/api/results/wordcount");
    const jsonResponse = await response.json();
    if(response.ok){
        return jsonResponse;
    } else {
        let err = jsonResponse;
        throw err;  // An object with the error coming from the server
    }
}

async function getAccuracy() {
    const response = await fetch("/api/results/sentiment/accuracy");
    const jsonResponse = await response.json();
    if(response.ok){
        return jsonResponse;
    } else {
        let err = jsonResponse;
        throw err;  // An object with the error coming from the server
    }
}

async function getSentiment() {
    const response = await fetch("/api/results/sentiment");
    const jsonResponse = await response.json();
    if(response.ok){
        return jsonResponse;
    } else {
        let err = jsonResponse;
        throw err;  // An object with the error coming from the server
    }
}

/*
import axios from 'axios';

async function sendFile(file, SetLoaded) {

    const data = new FormData();
    data.append('sampleFile', file);

    return new Promise((resolve, reject) => {

        axios.post("/api/training/documents/upload", data, { // receive two parameter endpoint url ,form data 
            onUploadProgress: ProgressEvent => {
                SetLoaded(ProgressEvent.loaded / ProgressEvent.total*100)}
        })
        .then(res => { // then print response status
            resolve(res.statusText);
        }).catch( (err) => {reject({msg: "error in connection", details: err}) }); // connection errors
    });
}
*/

async function sendText(review, sentimentExpected) {
    return new Promise((resolve, reject) => {
        fetch("/api/documents/text", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({reviewText: review, overall: sentimentExpected}),
        }).then( (response) => {
            
            if(response.ok) {
                resolve(response.statusText);
            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({msg: "cannot parse response", details: err}) }); // something else
            }
        }).catch( (err) => {reject({msg: "error in connection", details: err}) }); // connection errors
    });
}

const API = { getWordCount, getAccuracy, getSentiment, sendText } ;
export default API;
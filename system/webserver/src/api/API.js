/*import Brand from './Brand';
import Category from './Category';
import Model from './Model';
import Rental from './Rental';


async function getModels(brands, categories) {
    let url = "/api/models";

    if(brands.length || categories.length){
        
        let queryParams = "?";

        for (let i = 0; i < brands.length; i++) {
            if(i) queryParams += "&";
            queryParams += `brands[]=${brands[i]}`;
        }

        for (let i = 0; i < categories.length; i++) {
            if(brands.length || i) queryParams += "&";
            queryParams += `categories[]=${categories[i]}`;
        }

        url += queryParams;
    }

    const response = await fetch(url);
    const modelsJson = await response.json();
    console.log(modelsJson);
    if(response.ok){
        return modelsJson.map((m) => Model.from(m));
    } else {
        let err = modelsJson;
        throw err;  // An object with the error coming from the server
    }
}

async function getCategories() {
    const response = await fetch("/api/categories");
    const categoriesJson = await response.json();
    if(response.ok){
        return categoriesJson.map((c) => Category.from(c));
    } else {
        let err = categoriesJson;
        throw err;  // An object with the error coming from the server
    }
}

async function getBrands() {
    const response = await fetch("/api/brands");
    const brandsJson = await response.json();
    if(response.ok){
        return brandsJson.map((b) => Brand.from(b));
    } else {
        let err = brandsJson;
        throw err;  // An object with the error coming from the server
    }
}



async function searchAvailabilityRental(startDay, endDay, category, age, extraDrivers, estimatedKm, extraInsurance) {
    const response = await fetch(`/api/book?start_day=${startDay}&end_day=${endDay}&category_id=${category}&age=${age}&extra_drivers=${extraDrivers}&estimated_km=${estimatedKm}&extra_insurance=${extraInsurance}`);
    const modelsJson = await response.json();

    if(response.status === 401)
        window.location.reload(false); //loading page in order that app check if it is authorized when it is mounted (states of login will be deleted as well)

    if(response.ok){
        return modelsJson;
    } else {
        let err = modelsJson;
        throw err;  // An object with the error coming from the server
    }
}

async function createRental(startDay, endDay, category, age, extraDrivers, estimatedKm, extraInsurance, fullname, cardnumber, cvv, amount) {
    return new Promise((resolve, reject) => {
        fetch("/api/book", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({start_day: startDay, end_day: endDay, category_id: category, age: age, extra_drivers: extraDrivers, estimated_km: estimatedKm, extra_insurance: extraInsurance, fullname: fullname, cardnumber: cardnumber, cvv: cvv, amount: amount}),
        }).then( (response) => {
            
            if(response.status === 401)
                window.location.reload(false); //loading page in order that app check if it is authorized when it is mounted (states of login will be deleted as well)

            if(response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({msg: "cannot parse response", details: err}) }); // something else
            }
        }).catch( (err) => {reject({msg: "error in connection", details: err}) }); // connection errors
    });
}

async function getRentals() {
    const response = await fetch("/api/rentals");
    const rentalsJson = await response.json();

    if(response.status === 401)
        window.location.reload(false); //loading page in order that app check if it is authorized when it is mounted (states of login will be deleted as well)

    if(response.ok){
        return rentalsJson.map((r) => Rental.from(r));
    } else {
        let err = rentalsJson;
        throw err;  // An object with the error coming from the server
    }
}

async function deleteRental(rentalId) {
    return new Promise((resolve, reject) => {
        fetch("/api/rentals/" + rentalId, {
            method: 'DELETE'
        }).then( (response) => {

            if(response.status === 401)
                window.location.reload(false); //loading page in order that app check if it is authorized when it is mounted (states of login will be deleted as well)

            if(response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({msg: "cannot parse response", details: err}) }); // something else
            }
        }).catch( (err) => {reject({msg: "error in connection", details: err}) }); // connection errors
    });
}

const API = { isAuthenticated, getModels, userLogin, userLogout, getCategories, getBrands, searchAvailabilityRental, createRental, getRentals, deleteRental} ;
export default API;*/

import axios from 'axios';

async function getWordCount() {
    const response = await fetch("/api/results/wordcount");
    const jsonResponse = await response.json();
    if(response.ok){
        //return jsonResponse.map((c) => Category.from(c));
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
        //return jsonResponse.map((c) => Category.from(c));
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
        //return jsonResponse.map((c) => Category.from(c));
        return jsonResponse;
    } else {
        let err = jsonResponse;
        throw err;  // An object with the error coming from the server
    }
}

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

async function sendText(review, sentimentExpected) {
    return new Promise((resolve, reject) => {
        fetch("/api/training/documents/text", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({review: review, sentimentExpected: sentimentExpected}),
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

const API = { getWordCount, getAccuracy, getSentiment, sendFile, sendText } ;
export default API;
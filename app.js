//MODULES
const express = require('express');
const path = require('path')
const fs = require('fs');
const https = require('https');

//INSTANTIATE EXPRESS
const app = express();

//MIDDLEWARE
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, 'public')))

//GLOBAL VARIABLES
const keys = JSON.parse(fs.readFileSync(path.join(__dirname, 'keys.json')));
const apiKey = keys.apiKey;
const listId = keys.listId;

//HTTP REQUEST HANDLERS
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'))
})

app.post('/', (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    }
    const jsonData = JSON.stringify(data);

    const url = path.join('https://us6.api.mailchimp.com/3.0/', 'lists', listId)
    const options = {
        method: "POST",
        auth: `JamesBakker:${apiKey}`
    }
    const request = https.request(url, options, function (response) {
        response.on("data", function (data) {
            console.log(response.statusCode)
            if (response.statusCode === 200) {
                res.sendFile(path.join(__dirname, 'success.html'))
            } else {
                res.sendFile(path.join(__dirname, 'failure.html'))
            }
        })
    })
    request.write(jsonData);
    request.end();
})

//START SERVER
app.listen(3000, function () {
    console.log('Server is running on port 3000');
})
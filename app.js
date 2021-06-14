//MODULES
require('dotenv').config()
const express = require('express');
const path = require('path')
const https = require('https');

//INSTANTIATE EXPRESS
const app = express();

//MIDDLEWARE
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, 'public')))

//ENVIRONMENT  VARIABLES
const apiKey = process.env.API_KEY
const listId = process.env.LIST_ID
console.log(typeof listId);

//HTTP REQUEST HANDLERS
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'))
})

app.post('/failure', (req, res) => {
    res.redirect('/')
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
            console.log(JSON.parse(data))
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

//404 HANDLER
app.get('*', function (req, res) {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});

//START SERVER
app.listen(process.env.PORT, function () {
    console.log('Server is running on port 3000');
})
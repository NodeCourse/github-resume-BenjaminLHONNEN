const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const request = require('request');
let user;


app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/detail/:user', (req, res) => {
    const userName = req.params.user;
    getUserInfoByUsername(userName, (err, response, body, user) => {
        if (user) {
            res.render('detail', {
                user: user,
            });
        } else{
            res.render('index', {err:"User Not Found"});
        }
    });
});


function getUserInfoByUsername(name, callback) {
    request({
        headers: {
            'User-Agent': 'Node App',
        },
        uri: 'https://api.github.com/users/' + name,
    }, (err, response, body) => {
        if (err) {
            console.error(err);
        } else if (Math.floor(response.statusCode / 100) === 2) {
            console.log(response.statusCode);
            // body is a string that needs to be parsed
            user = JSON.parse(body);
            user.created_at = user.created_at.replace("T", " ");
            user.created_at = user.created_at.replace("Z", "");
            callback(err, response, body, user)
        } else if (response.statusCode === 403) {
            user = require('./default.json');
            user.created_at = user.created_at.replace("T", " ");
            user.created_at = user.created_at.replace("Z", "");
            let tmp = user.created_at.split(" ");
            user.created_at = tmp[1] + " " + tmp[0];
            callback(err, response, body, user)
        } else {
            callback(err, response, body, null)
        }
    });
}


app.listen(3000);
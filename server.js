const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));

// body parser config
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// routes
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/search', (req, res) => {
    // get user search 
    title = req.body.title;
    title = title.replace(/\s/g, "+")

    // search volume list from google books api
    request.get(`https://books.googleapis.com/books/v1/volumes?q=${title}&maxResults=10&orderBy=relevance&fields=items(id, volumeInfo(title, subtitle, authors, imageLinks(thumbnail)))`, function (err, response, body){
        body = JSON.parse(body);
        let bookList = []

        body.items.forEach(item => {
            // send id info inside volumeInfo object
            item.volumeInfo.id = item.id;
            // send volumeInfo to array
            bookList.push(item.volumeInfo)
        });

        res.render('results', {bookList: bookList});
    })
});

app.get("/book:id", (req, res) => {
    let id = req.params.id;
});

app.listen(3000, () => {
    console.log('app running on port 3000');
});


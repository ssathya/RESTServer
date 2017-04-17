var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var _ = require('underscore');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

function ParseInputValue(req) {
    var newBook = {};
    newBook.id = req.body.id;
    newBook.name = req.body.name;
    newBook.description = req.body.description;
    newBook.price = req.body.price;
    newBook.category_id = req.body.category_id;
    newBook.category_name = req.body.category_name;
    return newBook;
}
app.get('/api/books', (req, res) => {
    fs.readFile(__dirname + "/data/books.json", 'utf8', (err, data) => {
        if (err) { console.log(err); res.status(500); }
        res.send(JSON.parse(data));
    })
});
app.get('/api/books/:id', (req, res) => {
    fs.readFile(__dirname + "/data/books.json", 'utf8', (err, data) => {
        if (err) { console.log(err); res.status(500); }
        var books = JSON.parse(data);
        var identifier = {};
        identifier.id = req.params.id;
        var theBook = _.findWhere(books, identifier);
        if (theBook) {
            res.send(theBook);
        }
        else {
            res.status(404);
            res.send('');
        }
    });
});
app.post('/api/books', (req, res) => {
    fs.readFile(__dirname + "/data/books.json", 'utf8', (err, data) => {
        if (err) { console.log(err); res.status(500); }
        var newBook = ParseInputValue(req);
        var fileData = JSON.parse(data);
        fileData.push(newBook);
        fs.writeFile(__dirname + "/data/books.json", JSON.stringify(fileData, null, '\t'));
        res.send(newBook);
    });
});
app.put('/api/books', (req, res) => {
    fs.readFile(__dirname + "/data/books.json", 'utf8', (err, data) => {
        if (err) { console.log(err); res.status(500); }
        var newBook = ParseInputValue(req);
        var fileData = JSON.parse(data);
        var record = _.findWhere(fileData, { 'id': newBook.id });
        if (record) {
            var index = fileData.indexOf(record);
            if (index !== -1) {
                fileData[index] = newBook;
            }
        }
        //fileData.push(newBook);
        fs.writeFile(__dirname + "/data/books.json", JSON.stringify(fileData, null, '\t'));
        res.send(newBook);
    });
});
app.delete('/api/books/:id', (req, res) => {
    fs.readFile(__dirname + "/data/books.json", 'utf8', (err, data) => {
        if (err) { console.log(err); res.status(500); }
        var books = JSON.parse(data);
        var identifier = {};
        identifier.id = req.params.id;
        var theBook = _.findWhere(books, identifier);
        if (theBook) {
            var index = books.indexOf(theBook);
            if (index !== -1) {
                books.splice(index, 1);
                fs.writeFile(__dirname + "/data/books.json", JSON.stringify(books, null, '\t'));
                res.status(200);
                res.send('');
            }
            else{
            res.status(500);
            res.send('');
            }
        }
        else {
            res.status(404);
            res.send('');
        }
    });
});

var server = app.listen(3000, () => {
    var host = server.address().address;
    var port = server.address().port;
    console.log('App listening at http://%s:%s', host, port);
});
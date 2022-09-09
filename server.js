var express = require('express'),
    path = require('path'),
    api = require('./api'),
    config = require('./config'),
    bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));


app.get('/about', function (req, res) {
    res.sendFile(path.join(__dirname + '/views/about.html'));
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.get('/search', function (req, res) {
    res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.get('/program', function (req, res) {
    res.sendFile(path.join(__dirname + '/views/program.html'));
});

app.get('/universities', function (req, res) {
    res.sendFile(path.join(__dirname + '/views/universities.html'));
});

app.get('/university', function (req, res) {
    res.sendFile(path.join(__dirname + '/views/university.html'));
});

app.get('/search', function (req, res) {
    res.sendFile(path.join(__dirname + '/views/search.html'));
});

app.get('/img/custom.css', function (req, res) {
    res.sendFile(path.join(__dirname + '/img/custom.css'));
});

app.get('/img/custom.min.css', function (req, res) {
    res.sendFile(path.join(__dirname + '/img/custom.min.css'));
});

app.get('/controller.js', function (req, res) {
    res.sendFile(path.join(__dirname + '/controller.js'));
});

app.get('/img/logo-sm.png', function (req, res) {
    res.sendFile(path.join(__dirname + '/img/logo-sm.png'));
});

app.get('/img/logo-lg.png', function (req, res) {
    res.sendFile(path.join(__dirname + '/img/logo-lg.png'));
});


app.get('/listPrograms', api.listPrograms);
app.get('/listUniversities', api.listUniversities);
app.get('/listUniversitiesTypeahead', api.listUniversitiesTypeahead);
app.get('/findProgramById', api.findProgramById);
app.get('/findProgramsByUniversityId', api.findProgramsByUniversityId);
app.post('/searchPrograms/', api.searchPrograms);
app.post('/saveUniversity', api.saveUniversity);
app.post('/saveProgram', api.saveProgram);
app.get('/findUniversityById', api.findUniversityById);
app.get('/findUniversityNameById', api.findUniversityNameById);
app.delete('/deleteProgram/:id', api.deleteProgram);
app.delete('/deleteUniversity/:id', api.deleteUniversity);

app.listen(config.node_port, function () {
    console.log('Express server listening on port ' + config.node_port + ', DB is MongoDB');
});
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    path = require('path'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session'),
    MongoStore = require('connect-mongo')(expressSession),
    MongoClient = require('mongodb').MongoClient,
    setting = require('./setting.js'),
    port = process.env.PORT || setting.port;

var index = require('./routes/index.js');
var topic = require('./routes/topic.js');
var experience = require('./routes/experience.js');
var chat = require('./routes/chat.js');
var user = require('./routes/user.js');
var topic_show = require('./routes/topic_show.js');

MongoClient.connect(setting.url, function(err, db){
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    app.use(bodyParser.urlencoded({extended: false}));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(cookieParser());
    app.use(expressSession({
        secret: setting.cookieSecret,
        cookie: {maxAge: 3600000},
        store: new MongoStore({
            url: setting.url,
            ttl: 3600
        })
    }));

    app.use('/', index(db));
    app.use('/topic', topic(db));
    app.use('/experience', experience(db));
    app.use('/chat', chat(db));
    app.use('/user', user(db));
    app.use('/topic_show', topic_show(db));
    app.get('/updateLogin', function(req, res){
        if(req.session.user){
                db.collection('users').findOneAndUpdate(
                    {'username': req.session.user.username},
                    {'$set': {'login': (new Date()).toLocaleString()}},
                    function (err, result) {
                        res.end();
                    });
        }
    });
    app.get('/action', function(req, res){
            if(req.query.action === '0'){
                db.collection('experiences').updateOne(
                    {'_id': parseInt(req.query.id)},
                    {'$inc': {'zan': 1}},
                    function(){
                        res.end();
                    });
            }else{
                db.collection('experiences').updateOne(
                    {'_id': parseInt(req.query.id)},
                    {'$inc': {'ken': 1}},
                    function(){
                        res.end();
                    }
                );
            }
    });

    io.on('connection', function(socket){
        io.emit('join');
        socket.on('message', function(message){
            io.emit('message', message);
                db.collection('history').insertOne({
                    nickname: message.nickname,
                    content: message.content,
                    date: (new Date()).toLocaleString()
                });
        });
        socket.on('disconnect', function(){
            io.emit('left');
        });
    });

    server.listen(port);
});
var express = require('express'),
    router = express.Router();
module.exports = function(db){
    router.get('/', function(req, res){
            var records = [];
            db.collection('topics').find({}, {'title': 1}).sort({'readNum':-1}).limit(15).each(function(err, doc){
                if(doc != null){
                    records.push(doc);
                } else {
                    res.render('index', {
                        title: '拾节操',
                        captions: records,
                        user: req.session.user
                    });
                }
            });
    });

    router.get('/logout', function(req, res){
        req.session.destroy(function(){
            res.redirect('back');
        });
    });
    router.post('/check', function(req, res){
            db.collection('users').findOne({'username': req.body.username}, function(err, doc){
                if(doc) res.send(true);
                else res.send(false);
                //db.close();
            });
    });
    router.post('/reg', function(req, res){
            db.collection('users').insertOne({
                username: req.body.username,
                nickname: req.body.nickname,
                pwd: req.body.pwd,
                experNum: 0,
                goldNum: 0,
                sign: '这位拾友很懒,什么也没留下!',
                login: (new Date()).toLocaleString()
            }, function (err) {
                req.session.user = {username: req.body.username, nickname: req.body.nickname};
                res.redirect('back');
            });
    });

    router.post('/login', function(req, res){
            db.collection('users').findOne({'username': req.body.username}, function(err, doc){
                if(doc){
                    if((doc.username === req.body.username) && (doc.pwd === req.body.pwd)) {

                        req.session.user = {username: doc.username, nickname: doc.nickname};

                        res.redirect('back');
                    } else {
                        res.send(false);
                    }
                } else {
                    res.send(false);
                }
            });
    });

    return router;
};
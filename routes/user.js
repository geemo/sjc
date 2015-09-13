var express = require('express'),
    router = express.Router();
module.exports = function(db){
    router.get('/', function(req, res){

        if(req.query.username){
            if(req.query.nav==='modify' && !req.session.user){
                res.redirect('/');
            }else{
                switch(req.query.nav){
                    case 'topics':
                        var records = [];
                        db.collection('topics').find(
                            {'username':req.query.username},
                            {'username':1, 'title':1})
                            .limit(5)
                            .each(function(err, doc){
                                if(doc != null){
                                    records.push(doc);
                                }else{
                                    res.render('user', {
                                        title: '个人信息',
                                        queryUsername: req.query.username,
                                        user: req.session.user,
                                        topics: records,
                                        nav: req.query.nav
                                    });
                                }
                            });
                        //});
                        break;
                    case 'comments':
                        var records = [];
                        db.collection('comments').find(
                            {'username':req.query.username},
                            {'_id':0,'username':1,'content':1,'topicid':1})
                            .limit(5)
                            .each(function(err, doc){
                                if(doc != null){
                                    records.push(doc);
                                }else{
                                    res.render('user', {
                                        title: '个人信息',
                                        queryUsername: req.query.username,
                                        user: req.session.user,
                                        comments: records,
                                        nav: req.query.nav
                                    });
                                }
                            });
                        break;
                    case 'modify':
                        res.render('user', {
                            title: '个人信息',
                            queryUsername: req.query.username,
                            user: req.session.user,
                            nav: req.query.nav
                        });
                        break;
                    default:
                        db.collection('users').findOne(
                            {'username':req.query.username},
                            function(err, doc){
                                res.render('user', {
                                    title: '个人信息',
                                    queryUsername: req.query.username,
                                    user: req.session.user,
                                    queryUser: doc,
                                    nav: req.query.nav
                                });
                            });
                }
            }

        }else{
            res.redirect('/');
        }
    });

    router.post('/', function(req, res){
        if(!req.body.pwd && !req.body.sign && req.body.nickname === req.session.user.nickname){
            res.redirect('/');
        }else{
            db.collection('topics').update(
                {'username':req.session.user.username},
                {'$set':{'nickname':req.body.nickname}},
                {'multi':true},
                function(err, result){
                    db.collection('comments').update(
                        {'username':req.session.user.username},
                        {'$set':{'nickname':req.body.nickname}},
                        {'multi':true},
                        function(err, result){

                            if(req.body.pwd){
                                db.collection('users').findOneAndUpdate(
                                    {'username':req.session.user.username},
                                    {'$set':{'nickname':req.body.nickname,'sign':req.body.sign,'pwd':req.body.pwd}},
                                    function(err, result){
                                        req.session.user.nickname = req.body.nickname;
                                        res.end();
                                    });
                            }else{
                                db.collection('users').findOneAndUpdate(
                                    {'username':req.session.user.username},
                                    {'$set':{'nickname':req.body.nickname,'sign':req.body.sign}},
                                    function(err, result){
                                        req.session.user.nickname = req.body.nickname;
                                        res.end();
                                    });
                            }
                        });
                });
            //});
        }
    });

    router.get('/show_more_topic', function(req, res){
        var pageNumber = parseInt(req.query.pageNumber);
        pageNumber = pageNumber > 1 ? pageNumber : 1;
        var records = [];

        db.collection('topics').find(
            {'username':req.query.username},
            {'title':1})
            .skip((pageNumber-1) * 5)
            .limit(5)
            .each(function(err, doc){
                if(doc != null){
                    records.push(doc);
                }else{
                    res.send(records);
                }
            });
    });

    router.get('/show_more_comment', function(req, res){
        var pageNumber = parseInt(req.query.pageNumber);
        pageNumber = pageNumber > 1 ? pageNumber : 1;
        var records = [];

        db.collection('comments').find(
            {'username':req.query.username},
            {'_id':0,'content':1,'topicid':1})
            .skip((pageNumber-1) * 5)
            .limit(5)
            .each(function(err, doc){
                if(doc != null){
                    records.push(doc);
                }else{
                    res.send(records);
                }
            });
    });

    return router;
};
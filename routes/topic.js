var express = require('express'),
    router = express.Router();
module.exports = function(db){
    router.get('/', function(req, res){
        var records = [];
        switch(req.query.order){
            case '1':
                db.collection('topics').find().sort({'readNum':-1, 'answerNum':-1}).limit(5).each(function(err, doc){
                    if(doc != null){
                        records.push(doc);
                    } else {
                        res.render('topic',{
                            title: '话题舍',
                            topics: records,
                            user: req.session.user,
                            url: req.url,
                            order: '1'
                        });
                    }
                });

                break;
            case '2':
                db.collection('topics').find().sort({'finalCommentDate':-1}).limit(5).each(function(err, doc){
                    if(doc != null){
                        records.push(doc);
                    } else {
                        res.render('topic',{
                            title: '话题舍',
                            topics: records,
                            user: req.session.user,
                            url: req.url,
                            order: '2'
                        });
                    }
                });
                break;
            default:
                db.collection('topics').find().sort({'_id':-1}).limit(5).each(function(err, doc){
                    if(doc != null){
                        records.push(doc);
                    } else {
                        res.render('topic',{
                            title: '话题舍',
                            topics: records,
                            user: req.session.user,
                            url: req.url,
                            order: '0'
                        });
                    }
                });
                break;
        }

        //});
    });
    router.get('/show_more', function(req, res){
        var pageNumber = parseInt(req.query.pageNumber);
        pageNumber = pageNumber > 1 ? pageNumber : 1;
        var records = [];
        switch(req.query.order){
            case '1':
                db.collection('topics').find().sort({'readNum':-1, 'answerNum':-1}).skip((pageNumber-1) * 5).limit(5).each(function(err, doc){

                    if(doc != null){
                        records.push(doc);
                    } else {
                        res.send(records);
                    }
                });
                break;
            case '2':
                db.collection('topics').find().sort({'finalCommentDate':-1}).skip((pageNumber-1) * 5).limit(5).each(function(err, doc){

                    if(doc != null){
                        records.push(doc);
                    } else {
                        res.send(records);
                    }
                });
                break;
            default:
                db.collection('topics').find().sort({'_id':-1}).skip((pageNumber-1) * 5).limit(5).each(function(err, doc){

                    if(doc != null){
                        records.push(doc);
                    } else {
                        res.send(records);
                    }
                });
                break;
        }
    });
    router.get('/add', function(req, res){

        res.render('add', {
            title: '话题舍',
            user: req.session.user
        })
    });

    router.post('/post', function(req, res){
        var date = (new Date()).toLocaleDateString();
        db.collection('topics').insertOne({
            title: req.body.title,
            content: req.body.content,
            readNum: 0,
            answerNum: 0,
            tag: req.body.tag,
            username: req.session.user.username,
            nickname: req.session.user.nickname,
            date: date,
            finalCommentDate: date
        }, function(err, result){
            res.redirect('/topic');
        });
    });

    return router;
};
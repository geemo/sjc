var express = require('express'),
    router = express.Router(),
    mongodb = require('mongodb');
module.exports = function(db){
    router.get('/', function(req, res){
        if(req.query.postid){
            db.collection('topics').findOneAndUpdate(
                {'_id': mongodb.ObjectId(req.query.postid)},
                {$inc:{'readNum':1}},
                function(err, result){
                    var topic = result.value;
                    var records = [];
                    db.collection('comments').find({'topicid':req.query.postid},{_id:0}).each(function(err, doc){
                        if(doc != null){
                            records.push(doc);
                        } else {
                            res.render('topic_show', {
                                title: '话题评论舍',
                                user: req.session.user,
                                topic: topic,
                                comments: records
                            });
                        }
                    });
                });
        } else {
            res.redirect('back');
        }
        //});
    });
    router.post('/', function(req, res){
        var date = (new Date()).toLocaleString();
        db.collection('comments').insertOne(
            {
                'topicid':req.body.postid,
                'nickname':req.body.nickname,
                'username':req.body.username,
                'content':req.body.content,
                'date':date
            },
            function(err, result){
                db.collection('topics').findOneAndUpdate(
                    {'_id':mongodb.ObjectId(req.body.postid)},
                    {'$inc':{'answerNum':1, 'readNum':1}, '$set':{finalCommentDate: date}},
                    function(err, result){
                        var topic = result.value;
                        var records = [];
                        db.collection('comments').find({'topicid':req.body.postid},{_id:0}).each(function(err, doc){
                            if(doc != null){
                                records.push(doc);
                            } else {
                                res.render('topic_show', {
                                    title: '话题评论舍',
                                    user: req.session.user,
                                    topic: topic,
                                    comments: records
                                });

                            }
                        });


                    });
            });
    });

    return router;
};
var express = require('express'),
    router = express.Router();
module.exports = function(db){
    router.get('/', function(req, res){
        res.render('chat', {
            title: '激情聊天室',
            user: req.session.user
        });
    });

    router.get('/history', function(req, res){
            var records = [];
            if(req.query.pageNumber){
                var pageNumber = parseInt(req.query.pageNumber);
                db.collection('history')
                    .find({}, {'_id':0})
                    .skip(pageNumber > 1 ? (pageNumber-1)*10 : 0)
                    .limit(10)
                    .each(function(err, doc){
                        if(doc != null){
                            records.push(doc);
                        } else {
                            res.send(records);
                        }
                    });
            } else {
                var data = {};
                db.collection('history').count(function(err, count){
                    db.collection('history')
                        .find()
                        .limit(10)
                        .each(function(err, doc){
                            if(doc != null){
                                records.push(doc);
                            } else {
                                data.records = records;
                                data.recordCount = count;
                                res.send(data);
                            }
                        });
                });
            }
    });

    return router;
};
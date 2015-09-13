var express = require('express'),
    router = express.Router();
module.exports = function(db) {
    router.get('/', function (req, res) {
            var records = [];
            switch (req.query.order) {
                case '1':
                    db.collection('experiences').count(function (err, count) {
                        db.collection('experiences').find().sort({'ken': -1}).limit(5).each(function (err, doc) {
                            if (doc != null) {
                                records.push(doc);
                            } else {
                                res.render('experience', {
                                    title: '经验区',
                                    experiences: records,
                                    user: req.session.user,
                                    url: req.url,
                                    order: '1',
                                    count: count
                                });
                            }
                        });
                    });
                    break;
                case '2':
                    db.collection('experiences').count(function (err, count) {
                        db.collection('experiences').find().sort({'zan': -1}).limit(5).each(function (err, doc) {
                            if (doc != null) {
                                records.push(doc);
                            } else {
                                res.render('experience', {
                                    title: '经验区',
                                    experiences: records,
                                    user: req.session.user,
                                    url: req.url,
                                    order: '2',
                                    count: count
                                });
                            }
                        });
                    });
                    break;
                default:
                    db.collection('experiences').count(function (err, count) {
                        db.collection('experiences').find().sort({'_id': -1}).limit(5).each(function (err, doc) {
                            if (doc != null) {
                                records.push(doc);
                            } else {
                                res.render('experience', {
                                    title: '经验区',
                                    experiences: records,
                                    user: req.session.user,
                                    url: req.url,
                                    order: '0',
                                    count: count
                                });
                            }
                        });
                    });
                    break;
            }
    });


    router.get('/show_more', function (req, res) {

            var pageNumber = parseInt(req.query.pageNumber);
            pageNumber = pageNumber > 1 ? pageNumber : 1;
            var records = [];
            switch (req.query.order) {
                case '1':
                    db.collection('experiences').find().sort({'ken': -1}).skip((pageNumber - 1) * 5).limit(5).each(function (err, doc) {

                        if (doc != null) {
                            records.push(doc);
                        } else {
                            res.send(records);
                        }
                    });
                    break;
                case '2':
                    db.collection('experiences').find().sort({'zan': -1}).skip((pageNumber - 1) * 5).limit(5).each(function (err, doc) {

                        if (doc != null) {
                            records.push(doc);
                        } else {
                            res.send(records);
                        }
                    });
                    break;
                default:
                    db.collection('experiences').find().sort({'_id': -1}).skip((pageNumber - 1) * 5).limit(5).each(function (err, doc) {

                        if (doc != null) {
                            records.push(doc);
                        } else {
                            res.send(records);
                        }
                    });
                    break;
            }
    });

    return router;
};
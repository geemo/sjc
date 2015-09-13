var assert = require('assert');

module.exports = function(db, callback){
    var cursors = db.collection('topics').find().sort({_id:-1}).limit(5);
    var topics = [];
    cursors.each(function(err, doc){
        assert.equal(null, err);
        if(doc != null){
            topics.push(doc);
        } else {
            callback(topics);
        }
    });
};
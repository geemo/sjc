var assert = require('assert');

module.exports = function(db, callback){
    var cursors = db.collection('topics').find().sort({time:-1}).limit(15);
    var captions = [];
    cursors.each(function(err, doc){
        assert.equal(null, err);
        if(doc != null){
            captions.push(doc.title);
        } else {
            callback(captions);
        }
    });
};
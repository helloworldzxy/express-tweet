/**
 * Created by zhangxinyu on 2017/6/20.
 */
var request = require('superagent');


module.exports = function search(query, fn){
    request.get('“https://api.twitter.com/1.1/search/tweets.json')
        .query({ query: query })
        .end(function(res){
            if(res.body && Array.isArray(res.body.results)){
                return fn(null, res.body.results);
            }
            fn(new Error('Bad twitter response'));
        });
};
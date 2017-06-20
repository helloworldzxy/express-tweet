var express = require('express'),
    search = require('./search'),
    cookieParser = require('cookie-parser');

/**
 * 创建app
 */
// var app = express.createServer();
var app = express();

/**
 * 配置
 */
app.set('view engine', 'ejs');
app.set('views',  __dirname + '/views');
app.set('view options', { layout: false });
//获取配置信息
// console.log(app.set('views'));

//缓存模板，适用于生产环境，如果开发环境下这样设置，则每次模板有改动都需要重启Node进程。
// 以生产环境模式运行：$ NODE_ENV=production node server
// app.enable('view cache');
// is the same as:
// app.set('view cache', true);


/**
 * 定义Express路由，不必手动检查method和url
 * response对象有render方法，完成下列三件事：
 * 初始化模板引擎
 * 读取视图文件.ejs并将其传递给模板引擎(前面已经配置了模板引擎)
 * 获取解析后的HTML页面并作为响应发送给客户端
 */
app.get('/', function(req, res){
    res.render('index');
});

app.get('/search', function (req, res, next) {
    search(req.query.q, function(err, tweets){
        if(err){
            return next(err);
        }
        res.render('search', { //这里传递的对象为本地变量，只对其传递的视图可见
            results: tweets,
            search: req.query.q
        });
    });
});

//灵活的路由

app.get('/post/:name', function () {
    //when the url is: /post/hello-world
    //req.params.name == "hello-world"
});

app.get('/post/:name?', function(req, res, next){
    //this will match for /post and /post/a-post-here
});

app.get(/^\/post\/([a-z\d\-]*)/, function(req, res, next){
    //url matches RegExp capture groups
});

app.get('/post/:name', function (req, res, next) {
    if('h' != req.params.name[0]){
        return next();
    }
});

/**
 * 自定义错误处理中间件
 */
// app.error(function (err, req, res, next) {
//     if('Bad twitter response' == err.message){ //通过检测错误小心内容来判断是否要对错误进行处理
//         res.render('twitter-error');
//     } else {
//         next();
//     }
// });
//最后一个错误处理器，以上next传递到最后调用这个。
// app.error(function (err, req, res) {
//     res.render('error', { status: 500 });
// });

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

/**
 * Express构建于connect之上，可以直接使用connect的中间件
 */
app.use(express.static(__dirname + '/images'));
app.use(cookieParser()); //https://github.com/expressjs/cookie-parser?_ga=2.215569680.641417011.1497951088-1612060037.1497589234
app.use(express.session());

/**
 * 将中间件用于路由中
 */
function secure(req, res, next){
    if(!req.session.logged_in){
        return res.send(403);
        //或：确保该路由被跳过：
        // return next('route');
    }
}

app.get('/home', secure, function(){

});

//可为路由定义多个中间件
app.get('/route', a, b, c, function(){});

/**
 * 监听
 */
app.listen(3000);







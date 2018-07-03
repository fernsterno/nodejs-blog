'use strict';

var express = require('express');
var bodyParser = require('body-parser')
var Realm = require('realm')

var app = express();

let PostSchema = {
    name: 'Post',
    properties: {
      timestamp: 'date',
      title: 'string',
      content: 'string'
    }
};
  
var blogRealm = new Realm({
    path: 'blog.realm',
    schema: [PostSchema]
});

app.use(bodyParser.urlencoded({extended: true}))

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    let posts = blogRealm.objects('Post').sorted('timestamp', true);
    res.render('index.ejs', {posts: posts});
});

app.get('/write',function(req, res){
    res.sendFile(__dirname + "/views/write.html");
})

app.post('/write', function(req,res){
    let title = req.body['title'],
    content = req.body['content'],
    timestamp = new Date();
    blogRealm.write(() => {
        blogRealm.create('Post', {title: title, content: content, timestamp: timestamp});
    });
  res.sendFile(__dirname + "/views/write-complete.html");
})

app.listen(8000, function(){
    console.log('Go!');
})

// https://academy.realm.io/posts/realm-node-js-express-blog-tutorial/
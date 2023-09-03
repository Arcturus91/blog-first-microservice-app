const express = require('express');
const bodyParser = require('body-parser');
const {randomBytes} = require ('crypto');
const cors = require('cors')

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments',(req,res)=>{
    const {id} = req.params
    res.send(commentsByPostId[id]||[]);
    //tal como está explicado abajo. JS evalua que si el lado izquierdo es undefined, te envía el lado derecho.
})


app.post('/posts/:id/comments',(req,res)=>{
const commentId = randomBytes(4).toString('hex');
const {content} = req.body;
const comments  = commentsByPostId[req.params.id] || [];
//This is a common JavaScript idiom for providing a default value when a variable or object property might be undefined or falsy. It ensures that comments will always be an array, even if commentsByPostId[req.params.id] is not defined.
comments.push({id:commentId, content});

commentsByPostId[req.params.id] = comments;
res.status(201).send(comments);

})

app.listen('4001',()=>{
    console.log('Comments server running in port 4001');
})
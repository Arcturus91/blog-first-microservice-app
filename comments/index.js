const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  const { id } = req.params;
  res.send(commentsByPostId[id] || []);
  //tal como está explicado abajo. JS evalua que si el lado izquierdo es undefined, te envía el lado derecho.
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;
  const comments = commentsByPostId[req.params.id] || [];
  //This is a common JavaScript idiom for providing a default value when a variable or object property might be undefined or falsy. It ensures that comments will always be an array, even if commentsByPostId[req.params.id] is not defined.
  comments.push({ id: commentId, content });

  commentsByPostId[req.params.id] = comments;

  await axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: "pending",
    },
  }).catch((err) => {
    console.log('comment created error',err.message);
  });

  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
  console.log("Received event: ", req.body.type);

  const { type, data } = req.body;

  if (type === "CommentModerated") {
    console.log('comment moderated',req.body)
    const { postId, id, status, content } = data;
    const comments = commentsByPostId[postId];

    const comment = comments.find((item) => item.id === id);
    comment.status = status;

    //you dont need further modification because here you are changing values by reference. comments hold a reference to the commentsByPostId[postId] with the exact postId provided in the call. Then, if you change properties values inside the reference, you are directly changing original object value because all is related.

    await axios.post("http://localhost:4005/events", {
      type: "CommentUpdated",
      data: {
        id,
        status,
        postId,
        content,
      },
    }).catch((err) => {
      console.log('comment update axios post error',err.message);
    });;
  }

  res.send({ message: "All good" });
});

app.listen("4001", () => {
  console.log("Comments server running in port 4001");
});

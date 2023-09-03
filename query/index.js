const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

app.use(cors());
app.use(bodyParser.json());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});
app.post("/events", (req, res) => {
  const { type, data } = req.body;

  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === "CommentUpdated") {
    const { id, content, postId, status } = data;
    console.log('comment updated',status)
    const post = posts[postId];
    const comment = post.comments.find((comment) => comment.id === id);
    comment.status = status;
    comment.content = content; //we add again content because it might be the case that moderation service has modified the content.
    //we dont need to directly update the content inside the objet because we are updating an object by reference.
  }
  console.log("query post", posts);

  res.send({ message: "All good" });
});

app.listen("4002", () => {
  console.log("Query service Listening on port 4002");
});

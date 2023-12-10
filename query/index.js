const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const axios = require('axios')

app.use(cors());
app.use(bodyParser.json());

const posts = {};

const handleEvent = (type, data) => {
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
    console.log("comment updated", status);
    const post = posts[postId];
    const comment = post.comments.find((comment) => comment.id === id);
    comment.status = status;
    comment.content = content; //we add again content because it might be the case that moderation service has modified the content.
    //we dont need to directly update the content inside the objet because we are updating an object by reference.
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});
app.post("/events", (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);

  res.send({ message: "All good" });
});

app.listen("4002", async () => {
  console.log("Query service Listening on port 4002");
try {
  const res = await axios.get("http://event-bus-srv:4005/events").catch((err) => {
    console.log("Query service axios get error:", err.message);
  });

  for (const event of res.data) {
    console.log("processing event", event.type);
    const { type, data } = event;
    handleEvent(type, data);
  }
  
} catch (error) {
  console.log('Listening Query service error',error)
}
});

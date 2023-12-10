const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  if (type === "CommentCreated") {
    console.log('moderation',data.content) 
    const status = data.content.includes("orange") ? "rejected" : "approved";
    await axios.post("http://event-bus-srv:4005/events", {
      type: "CommentModerated",
      data: {
        id: data.id,
        content: data.content, 
        postId: data.postId,
        status,
      },
    });
  }
  res.send({status:'ok'}) //if you dont provide a response, the event handler will hang and probably generate a timeout error in the client.
});

app.listen("4003", () => {
  console.log("Moderation listening on port 4003...");
});

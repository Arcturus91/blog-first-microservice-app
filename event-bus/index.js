const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const events = [];

app.post("/events", (req, res) => {
  const event = req.body;
  console.log("am an event received", event);

  events.push(event);

   //Comments
  axios.post("http://comments-srv:4001/events", event).catch((err) => {
    console.log(err.message);
  }); 

  //POST event to Posts microserv.
  axios.post("http://posts-clusterip-srv:4000/events", event).catch((err) => {
    console.log("posts axios post error", err.message);
  });

   //Query
  axios.post("http://query-srv:4002/events", event).catch((err) => {
    console.log("query axios post error", err.message);
  }); 

  //Moderation
  axios.post("http://moderation-srv:4003/events", event).catch((err) => {
    console.log("moderation axios post error", err.message);
  });
 
  res.send({ status: "ok" });
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen("4005", () => {
  console.log("Event bus, Listening on port 4005...");
});

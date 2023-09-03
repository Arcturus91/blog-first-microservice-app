const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

app.post("/events", (req, res) => {
  const event = req.body;
  console.log("am event", event);
  //Posts
  axios.post("http://localhost:4001/events", event).catch((err) => {
    console.log(err.message);
  });

  //Comments
  axios.post("http://localhost:4000/events", event).catch((err) => {
    console.log('comments axios post error', err.message);
  });

  //Query
  axios.post("http://localhost:4002/events", event).catch((err) => {
    console.log('query axios post error',err.message);
  });

  //Moderation
  axios.post("http://localhost:4003/events", event).catch((err) => {
    console.log('moderation axios post error',err.message);
  });

  res.send({ status: "ok" });
});

app.listen("4005", () => {
  console.log("Event bus, Listening on port 4005...");
});

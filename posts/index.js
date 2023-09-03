const express = require("express");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express(); // En el call stack, necesitas primero completar esto o completar el execution context que hay adentro de express() para poder tener el callstack limpio. Es decir, no seguirá leyendo hasta que la expresión const app = esté completa

app.use(bodyParser.json());
app.use(cors());

const posts = {};
// mientras node se siga ejecutando, el heap existirá entonces habrá una referencia en la memoria a este objeto y su contenido

app.get("/posts", (req, res) => {
  res.send(posts);
});
app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };

  await axios.post("http://localhost:4005/events", {
    type: "PostCreated",
    data: { id, title },
  });

  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
  console.log("Received event: ", req.body.type);
  res.send({message:'All good'});
});

app.listen(4000, () => {
  console.log("Posts, Listening on port 4000...");
});

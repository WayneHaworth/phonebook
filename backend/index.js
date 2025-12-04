import express from "express";
import morgan from "morgan";
import Contact from "./models/contact.js";

const app = express();

app.use(express.json());
app.use(express.static("dist"));

app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ");
  })
);

//web
app.get("/", (request, response) => {
  response.send("<h1>hello world</h1>");
});
app.get("/info", (request, response) => {
  Contact.countDocuments()
  .then((total_entries) => {
    const now = new Date(8.64e15).toString();
    response.send(`
            Phonebook has info for ${total_entries} people </br>
            ${now}
        `);
  });
});

//api
app.get("/api/persons", (request, response) => {
  Contact.find({}).then((persons) => {
    response.json(persons);
  });
});
app.get("/api/persons/:id", (request, response, next) => {
  Contact.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});
app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Contact.findByIdAndDelete(id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});
app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (!body) return response.status(400).end();
  if (!body.name) return response.status(400).json({ error: "name missing" });
  if (!body.number)
    return response.status(400).json({ error: "number missing" });

  const contact = new Contact({
    name: body.name,
    number: body.number,
  });

  contact.save()
  .then((savedContact) => {
    response.json(savedContact);
  })
  .catch(error => next(error))
});

app.put("/api/persons/:id", (request, response, next) => {
  const contact = request.body;

  Contact.findById(request.params.id)
    .then((person) => {
      if (!person) {
        return response.status(404).end();
      }
      person.name = contact.name;
      person.number = contact.number;

      return person.save().then((updatedContact) => {
        response.json(updatedContact);
      });
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name == "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  if (error.name == "ValidationError") {
    return response.status(400).json( { error: error.message })
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

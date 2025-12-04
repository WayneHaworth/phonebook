import express from "express";
import morgan from "morgan";
import Contact from "./models/contact.js";

const app = express();

app.use(express.json())
app.use(express.static('dist'))

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))


let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

//web
app.get("/", (request, response) => {
  response.send("<h1>hello world</h1>");
});
app.get("/info", (request, response) => {
  const total_entries = persons.length;
  const now = new Date(8.64e15).toString();
  response.send(`
        Phonebook has info for ${total_entries} people </br>
        ${now}
    `);
});

//api
app.get("/api/persons", (request, response) => {
  Contact.find({}).then(persons => {
    response.json(persons)
  })
});
app.get("/api/persons/:id", (request, response) => {
  Contact.findById(request.params.id).then( person => {
    response.json(person)
  })
});
app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);

  if (!person) return response.status(404).end();
  
  persons = persons.filter((person) => person.id != id);
  response.json(persons);
});
app.post("/api/persons", (request, response) => {
    const body = request.body

    if (!body) return response.status(400).end();
    if (!body.name) return response.status(400).json( { error: 'name missing' })
    if (!body.number) return response.status(400).json( { error: 'number missing' })
    
    const contact = new Contact({
        name: body.name,
        number: body.number
    })  
    
    contact.save().then( savedContact => {
      response.json(savedContact)
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
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

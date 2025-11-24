import mongoose from "mongoose";

const password = process.argv[2];
const url = `mongodb+srv://waynehaworth:${password}@cluster0.unlx2fj.mongodb.net/phonebookApp?appName=Cluster0`;

mongoose.set("strictQuery", false);
mongoose.connect(url, { family: 4 });

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Contact = mongoose.model("Contact", contactSchema);

if (process.argv.length < 3) {
  console.log("give password as an argument");
  process.exit(1);
} else if (process.argv.length === 3) {
  Contact.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((contact) => {
      console.log(`${contact.name} ${contact.number}`);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];
  const contact = new Contact({
    name,
    number,
  });

  contact.save().then((result) => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  console.log("invalid number of arguments");
}

# casual-mongoose
A mongodb seeder using Mongoose and Casual

## Installation
`npm install casual-mongoose --save`

# API
Name|Definition
----|----
db|_Required._ Name of your database
host|_Required._ Database host
port|_Optional_. Database port
username|_Optional_. Database user
password|_Optional_. Database password

# seed(Schema, count, fields)
Arg|Definition
----|----
Schema|Mongoose model from your project
count|How many models to save
fields|An object of fields: strings, numbers, objects, and arrays.

# exit()
The exit function waits for `Promise.all` to finish and then exits the terminal process.

# Using casual API with fields
**Casual API** https://github.com/boo1ean/casual

You do not need to execute anything from casual, but rather use it's API through strings. If the string must execute, you can set the field as `executable` with a string of the function called off of casual. If you wish to use your own string, simply use a string that does not represent a field from the casual API.

# Example Setup
Using `async/await`, you can set up your documents, related documents, and subdocuments, finishing off with an exit command.
```javascript
// scripts/seed.js

const CasualMongoose = require('casual-mongoose');
const AuthorSchema = require('../authors'); // ie. Mongoose.model('author', AuthorSchema);
const BookSchema = require('../books'); // ie. Mongoose.model('book', BookSchema);

// Setup a CasualMongoose
const casualMongoose = new CasualMongoose({
  db: 'mydatabase',
  host: 'localhost',
});

async function authors() {
  return await casualMongoose.seed(AuthorSchema, 10, {
    firstName: 'first_name',
    lastName: 'last_name',
  });
}

// Setup a related document
async function book(id) {
  return await casualMongoose.seed(BookSchema, 1, {
    authorId: id,
    title: 'title',
    chapters: { executable: 'integer(15, 40)' },
    pages: { executable: 'integer(100, 300)' },
    signed: 'yes',
  });
}

async function buildAuthors() {
  const authorList = await authors();

  authorList.forEach(async ({ _id }) => await book(_id));
}

async function seedAll() {
  await buildAuthors();

  casualMongoose.exit();
}

seedAll();
```
```javascript
// package.json

"scripts": {
  "seed": "mongo databasename --eval \"db.dropDatabase()\"; node ./scripts/seed.js"
},
```
```
npm run seed
```

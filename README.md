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

# disconnect()
The disconnect function waits for `Promise.all` to finish, then disconnects from the database and exits the terminal process.

# Using casual API with fields
**Casual API** https://github.com/boo1ean/casual

```javascript
const cm = new CasualMongoose(config);
cm.casual
```
Casual is availabe off of the instance for convenience. You do not need to execute from casual if you do not wish, but rather use it's API with strings. If the string must execute, you can set the field as `executable` with a string of the function called off of casual. You can even use your own value.

# Example Setup
Using `async/await`, you can set up your documents, related documents, and subdocuments, finishing off with an exit command.
```javascript
// scripts/seed.js

const CasualMongoose = require('casual-mongoose');
const AuthorSchema = require('../authors'); // ie. Mongoose.model('author', AuthorSchema);
const BookSchema = require('../books'); // ie. Mongoose.model('book', BookSchema);

// Setup a CasualMongoose
const cm = new CasualMongoose({
  db: 'mydatabase',
  host: 'localhost',
});

async function seedAuthors() {
  return await cm.seed(AuthorSchema, 10, {
    firstName: 'first_name',
    lastName: 'last_name',
  });
}

// Setup a related document
async function seedBooks(id) {
  const bookCount =  Math.ceil(Math.random() * 5);
  
  return await cm.seed(BookSchema, bookCount, {
    authorId: id,
    title: 'title',
    chapters: { executable: 'integer(15, 40)' },
    pages: { executable: 'integer(100, 300)' },
    isSigned: { executable: 'random_element(["Confirmed", "Unconfirmed"]'),
  });
}

async function seedAuthorsWithBooks() {
  const authorList = await seedAuthors();

  authorList.forEach(async ({ id }) => await seedBooks(id));
}

await seedAuthorsWithBooks();

cm.disconnect();
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

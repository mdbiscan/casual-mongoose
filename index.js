const Mongoose = require('mongoose');
const casual = require('casual');
const _ = require('lodash');

const BASE_CONFIG = {
  host: 'localhost',
  db: '',
  schemas: [],
};

function _fields(fields) {
  var f = {};

  _.forIn(fields, (value, key) => {
    if (typeof value === 'object') {
      f[key] = eval(`casual.${value}`);
    } else {
      f[key] = casual[value];
    }
  });

  return f;
};

module.exports = class CasualMongoose {
  constructor(config = BASE_CONFIG) {
    this.host = config.host;
    this.db = config.db;
    this.schemas = config.schemas;
  }

  seed(Schema, count, fields) {
    Mongoose.connect(`mongodb://${this.host}/${this.db}`);

    Mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

    return new Promise((resolve, reject) => {
      Schema.create(_fields(fields), (err, schema) => {
        if (err) reject(err);

        Mongoose.connection.close()

        return resolve(schema);
      });
    });
  }
}

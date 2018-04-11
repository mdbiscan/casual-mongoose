const Mongoose = require('mongoose');
const casual = require('casual');
const _ = require('lodash');

const BASE_CONFIG = {
  db: '',
  host: 'localhost',
  port: 27017,
  username: null,
  password: null,
};

function _fields(fields) {
  var f = {};

  _.forIn(fields, (value, key) => {
    if (value.executable) {
      f[key] = eval(`casual.${value.executable}`);
    } else if(casual[value]) {
      f[key] = casual[value];
    } else {
      f[key] = value;
    }
  });

  return f;
};

function _schemaList(fields, count) {
  const s = [];

  _.times(count, () => s.push(_fields(fields)));

  return s;
};

module.exports = class CasualMongoose {
  constructor(config = BASE_CONFIG) {
    this.db = config.db;
    this.host = config.host;
    this.password = config.password;
    this.port = config.port;
    this.username = config.username;
    this.seeds = [];

    Mongoose.Promise = global.Promise;
    Mongoose.connection.on('error', () => console.log('CasualMongoose: unable to save schema'));

    if (this.password && this.username) {
      Mongoose.connect(`mongodb://${this.username}:${this.password}@${this.host}:${this.port}/${this.db}`);
    } else {
      Mongoose.connect(`mongodb://${this.host}/${this.db}`);
    }
  }

  seed(Schema, count, fields) {
    const schemaList = _schemaList(fields, count);

    const seed = new Promise((resolve, reject) => {
      Schema.create(schemaList, (err, schemaList) => {
        if (err) return reject(err);
        return resolve(schemaList);
      });
    });

    this.seeds.push(seed);

    return seed;
  }

  exit() {
    Promise.all(this.seeds).then(() => process.exit());
  }
}

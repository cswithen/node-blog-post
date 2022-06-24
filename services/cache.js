const mongoose = require("mongoose");
const redis = require("redis");
const util = require("util");

const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;
  // strinify in case someone passes an object or array
  this.hashKey = JSON.stringify(options.key || "");

  return this;
};

mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }

  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );

  // See if we have a value for 'key' in redis at the hashKey
  const cacheValue = await client.hget(this.hashKey, key);

  // if so, return that
  if (cacheValue) {
    const doc = JSON.parse(cacheValue);

    // need to 'hydrate' values to make sure the monkey-patch has what it needs to return
    Array.isArray(doc)
      ? doc.map((d) => new this.model(d))
      : new this.model(doc);
  }

  // otherwise, issue the query and store result in redis
  const result = await exec.apply(this, arguments);

  // 'EX' and # of seconds are used to expire caches
  client.hset(this.hashKey, key, JSON.stringify(result), "EX", 10);

  return result;
};

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  },
};

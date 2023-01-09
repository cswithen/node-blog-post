require("../models/User");

const mongoose = require("mongoose");
const keys = require("../config/keys");

// telling mongoose to use the global node Promise
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

afterAll(() => {
  mongoose.disconnect();
});

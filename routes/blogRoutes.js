const mongoose = require("mongoose");
const authenticate = require("@middleware/authenticate");

const Blog = mongoose.model("Blog");

module.exports = (app) => {
  app.get("/api/blogs/:id", authenticate, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id,
    });
    res.send(blog);
  });

  app.get("/api/blogs", authenticate, async (req, res) => {
    const redis = require("redis");    
    const redusUrl = "redis://127.0.0.1:6379";
    const client = redis.createClient(redusUrl);
    const util = require('util')
    // removes callback requirement
    client.get = util.promisify(client.get);

    // do we have any cached data related to this query
    const cachedBlogs = await client.get(req.user.id);
    
    // if yes, respond to request immediately
    if (cachedBlogs) {
      console.log('SERVING FROM CACHE')
      return res.send(JSON.parse(cachedBlogs));
    }
    
    // if no, need to respond to request and update our cache
    const blogs = await Blog.find({ _user: req.user.id });
   
    console.log('SERVING FROM MONGODB')
    res.send(blogs);
    
    client.set(req.user.id, JSON.stringify(blogs));
  });

  app.post("/api/blogs", authenticate, async (req, res) => {
    const { title, content } = req.body;
    const blog = new Blog({
      title,
      content,
      _user: req.user.id,
    });
    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
};

const express = require("express");
const cors = require("cors");
// middleware
const app = express();
app.use(express.json());
app.use(cors());

const mongoose = require("mongoose");
const options = {
  keepAlive: true,
  connectTimeoutMS: 10000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const dbUrl = `mongodb+srv://anyUser:Sita123Gita@cluster0.my2qezm.mongodb.net/?retryWrites=true&w=majority`;

// Mongo DB connection
mongoose.connect(dbUrl, options, (err) => {
  if (err) console.log(err);
});

// Validate DB connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Mongo DB Connected successfully");
});

// Schema for Book
let Schema = mongoose.Schema;
let postSchema = new Schema(
  {
    id: {
      type: Number,
    },
    content: {
      type: String,
    },
  },
  { timestamps: true }
);

let PostModel = mongoose.model("post", postSchema);

app.get("/", (req, res) => {
  res.send("Server is currently active...");
});

/** GET API: GETs Posts from DB and returns as response with status */
app.get("/posts", async (req, res) => {
  try {
    let posts = await PostModel.find();
    res.status(200).json({
      status: 200,
      data: posts,
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

/** POST API: Gets new book info from React and adds it to DB */
app.post("/posts", async (req, res) => {
  try {
    let post = new PostModel(req.body);
    post = await post.save();
    res.status(200).json({
      status: 200,
      data: post,
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

/** POST API: Deletes a given book from DB based on its id */
app.delete("/posts/:id", async (req, res) => {
  try {
    let posts = await PostModel.findByIdAndRemove(req.params.id);
    if (posts) {
      res.status(200).json({
        status: 200,
        message: "Post deleted successfully",
      });
    } else {
      res.status(400).json({
        status: 400,
        message: "No post found!!!",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
});

app.listen(8081, function () {
  console.log(`App listening at http://127.0.0.1:8081/`);
});

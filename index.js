const express = require("express");
const userSchema = require("./model/userSchema");
const { default: mongoose } = require("mongoose");
const emailValidation = require("./helpers/emailValadation");
const app = express();
const bcrypt = require("bcrypt");
const SecureApi = require("./middleware/secureApi");
const toduSchema = require("./model/toduSchema");
const multer = require("multer");
const path = require("path");
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
mongoose
  .connect(
    "mongodb+srv://exam:yQcOoFwlkYe8JRFX@cluster0.ocg1e0g.mongodb.net/exam?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Database is connected...");
  })
  .catch((err) => {
    console.log(err);
  });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/registration", SecureApi, (req, res) => {
  let { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.send({ error: "Invalid Creandatial" });
  } else if (!emailValidation(email)) {
    res.send({ error: "You have entered an invalid email address" });
  } else {
    bcrypt.hash(password, 10, function (err, hash) {
      if (err) {
        res.send({ error: err });
      } else {
        let user = new userSchema({
          name,
          email,
          password: hash,
        });
        user.save();
        res.send("registration successful");
      }
    });
  }
});

app.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let exitingUser = await userSchema.find({ email });
  if (exitingUser.length > 0) {
    bcrypt.compare(password, exitingUser[0].password, function (err, result) {
      if (result) {
        res.status(200).send({ message: "Login Successful" });
      } else {
        res.status(404).send({ error: "Login Failed" });
      }
    });
  } else {
    res.status(404).send({ error: "Login Failed" });
  }
});

app.post("/create", upload.single("avatar"), (req, res) => {
  let { title, decapitation, image } = req.body;

  let tudoCreate = new toduSchema({
    title: title,
    decapitation: decapitation,
    image: req.file.path,
  });
  tudoCreate.save();
  res.send(tudoCreate);
});

app.post("/update", async (req, res) => {
  let { title, decapitation } = req.body;

  let update = await toduSchema.findOneAndUpdate({ title }, decapitation, {
    new: true,
  });
  res.send(update);
});

app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  let update = await toduSchema.findByIdAndDelete(id);

  res.send("Deleted Successfully");
});

app.get("/alltudos", async (req, res) => {
  let data = await toduSchema.find({});
  res.send(data);
});

app.listen(3600, () => {
  console.log("Server is running, Port number is 3500");
});

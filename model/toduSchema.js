const mongoose = require("mongoose");
const { Schema } = mongoose;

let toduSchema = new Schema({
  title: String,
  decapitation: String,
  image: String,

  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User ",
  },
});

module.exports = mongoose.model("tudo", toduSchema);

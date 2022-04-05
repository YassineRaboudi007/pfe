const mongoose = require("mongoose");

const companySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    symbol: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
    },
    website: {
      type: String,
      required: [true, "Please add a wallet"],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Company", companySchema);

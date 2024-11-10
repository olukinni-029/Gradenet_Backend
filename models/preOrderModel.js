const mongoose = require("mongoose");

const preOrderSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    homeType: {
      type: String,
      required: [true, "Home type is required"],
      trim: true,
    },
    gpsAddress: {
      type: String,
      required: [true, "GPS address is required"],
      match: [/^[A-Z]{2}-\d{3}-\d{4}$/, "GPS Address must follow the format AK-039-5028"],
    },
    installationDate: {
      type: String,
      required: [true, "Installation date is required"],
      validate: {
        validator: function (value) {
          return !isNaN(Date.parse(value));
        },
        message: "Please enter a valid date",
      },
    },
    agentName: {
      type: String,
      required: [true, "Agent name is required"],
      trim: true,
    },
    package: {
      title: {
        type: String,
        required: [true, "Package title is required"],
      },
      monthlyPrice: {
        type: Number,
        min: [0, "Monthly price must be greater than 0"],
        // No `required` validation because only one price will be provided
      },
      yearlyPrice: {
        type: Number,
        min: [0, "Yearly price must be greater than 0"],
        // No `required` validation because only one price will be provided
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Custom pre-save validation to ensure only one price is provided
preOrderSchema.pre('save', function (next) {
  const package = this.package;

  if ((package.monthlyPrice && package.yearlyPrice) || (!package.monthlyPrice && !package.yearlyPrice)) {
    return next(new Error('Either monthlyPrice or yearlyPrice must be provided, but not both.'));
  }

  // Set the non-selected price field to undefined to prevent saving as null
  if (package.monthlyPrice) {
    package.yearlyPrice = undefined;
  } else if (package.yearlyPrice) {
    package.monthlyPrice = undefined;
  }

  next();
});


// Create the PreOrder model
const PreOrder = mongoose.model("PreOrder", preOrderSchema);

module.exports = PreOrder;

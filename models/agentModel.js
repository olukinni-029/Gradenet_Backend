const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const agentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true, 
    match: [/.+\@.+\..+/, "Please fill a valid email address"] 
  },
  phone:  {
    type: String,
    required: [true, "Phone number is required"],
    match: [/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"]
  },
  location: { type: String, required: true },
  region: { type: String, required: true },
  hearAboutUs: { type: String, trim:true, required: true },
  password: { 
    type: String, 
    required: true,
    alphanumeric: true, 
    minlength: [6, "Password must be at least 6 characters long"] 
  },
  confirmPassword: {
    type: String,
    required: true,
    alphanumeric: true,
    validate: {
      validator: function(value) {
        return value === this.password;
      },
      message: "Passwords do not match"
    }
  },
  agree: { type: Boolean, required: true }
},{
    timestamps: true,
    versionKey: false,
  });


agentSchema.pre('save', function(next) {
  // Only remove confirmPassword if it is the password match
  if (this.confirmPassword === this.password) {
    this.confirmPassword = undefined; // Remove confirmPassword
  }
  next();
});
agentSchema.pre("save", async function (next) {
    const agent = this;
    if (agent.isModified("password")) {
      agent.password = await bcrypt.hash(agent.password, 10);
    }
    next();
  });
  
  // Compare passwords for login
  agentSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };


module.exports = mongoose.model('Agent', agentSchema);

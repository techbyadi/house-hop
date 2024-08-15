import mongoose from "mongoose"

const Schema = mongoose.Schema

const userSchema = new Schema({
  firstname: {
    type: String, 
    required: true
  }, 
  lastname: String,
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  minPrice: Number,
  maxPrice: Number,
  homeType: String
}, {
  timestamps: true
})

const User = mongoose.model("User", userSchema)

export {
  User
}
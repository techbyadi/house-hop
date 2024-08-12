import mongoose from "mongoose";
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  notes: String,
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  reviewer: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
}, {
  timestamps: true
})

const addressSchema = new Schema({
  streetName: {
    type: String, 
    required: true
  }, 
  apartmentNumner: String, 
  city: {
    type: String, 
    required: true
  },
  state: {
    type: String, 
    required: true
  },
  country: {
    type: String,
    required: true
  },
  zipCode: {
    type: Number,
    required: true
  }, 
  neighborhood: String
},
{
  timestamps: true
})


const houseSchema = new Schema(
  {
    price: {
      type: Number,
      required: true,
    },
    bedrooms: Number,
    bathrooms: Number,
    size: Number,
    address: [addressSchema],
    propertyType: {
      type: String,
      enum: ["Single Family", "Town House", "Condo", "Multi Family"],
    },
    builtYear: {
      type: Number,
      default: function () {
        return new Date().getFullYear();
      },
      min: 1930,
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    }, 
    reviews: [reviewSchema],
    visited: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  });

  const House = mongoose.model('House', houseSchema);

  export {
    House
  };
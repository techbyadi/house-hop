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
  visitedDate : {
    type: Date
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
  apartmentNumber: {
    type: Number,
    required: true,
  }, 
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
  }
},
{
  timestamps: true
})


const houseSchema = new Schema(
  {
    houseImage: String,
    price: {
      type: Number,
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    address: addressSchema,
    propertyType: {
      type: String,
      enum: ["single_family", "townhomes", "multi_family", "apartment", "condos", "land", "mobile"],
    },
    builtYear: {
      type: Number,
      default: 1968,
      min: 1930,
      max: 2024
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    }, 
    reviews: reviewSchema,
    visited: {
      type: String,
      enum: ["Yes", "No"],
    },
  },
  {
    timestamps: true,
  });

  const House = mongoose.model('House', houseSchema);

  export {
    House
  };
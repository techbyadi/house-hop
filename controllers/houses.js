import { House } from "../models/house.js"
import fetch from "node-fetch";

async function index(req, res) {
  try {
    const houses = await House.find({}).populate('addedBy')    
    const houseCount = req.query.houseCount;
    console.log("Passed notification",  );
    res.render('houses/index', {
      houses, houseCount
  })
  } catch (error) {
    console.log(error);
    res.redirect('/')
  }
}

async function newHouse(req, res) { 
  try {
    const isHousePresent = await req.query.isHousePresent;
    res.render('houses/new.ejs', {
    isHousePresent
  });
  } catch (error) {
    console.log(error);
    res.redirect('/houses');
  }
  
}

async function create(req, res) {
  
  try {
    req.body.addedBy = req.session.user._id;
    for (let key in req.body) {
      if (req.body[key] === "") delete req.body[key];
    }

    const response = await fetch(
      "https://realty-in-us.p.rapidapi.com/properties/v3/list",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-host": "realty-in-us.p.rapidapi.com",
          "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        },
        body: JSON.stringify({
          limit: 1,
          offset: 0,
          address: req.body.streetName,
          city: req.body.city,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    
    const data = await response.json();

    const houseTotal = data.data.home_search.total;

    console.log("Data line 55: ", houseTotal);

    var isHousePresent = "yes";
    if(houseTotal === 0){
      isHousePresent = "no";
      console.log("Is house present's value: ", isHousePresent);
      res.redirect(`/houses/new?isHousePresent=${isHousePresent}`)
    }

    else {
    const result = data.data.home_search.results[0];

    const houseImage = result.primary_photo.href;
    const price = result.list_price;
    const propertyType = result.description.type;
    const bedrooms = result.description.beds;
    const bathrooms = result.description.baths_full;
    const size = result.description.sqft;
    const streetName = req.body.streetName;
    const city = result.location.address.city;
    const state = result.location.address.state_code;
    const country = result.location.address.country;
    const zipCode = result.location.address.postal_code;

    req.body.address = {
      streetName : streetName,
      apartmentNumber: "123",
      city: city,
      state: state,
      country: country,
      zipCode: zipCode,
    }
    
    req.body.houseImage = houseImage;
    req.body.price = price;
    req.body.propertyType = propertyType;
    req.body.bedrooms = bedrooms;
    req.body.bathrooms = bathrooms
    req.body.size = size;

    console.log("Full req.body before proceeding:", req.body);
    
    const house = await House.create(req.body);

    const houseCount= await House.countDocuments({
      'address.streetName': house.address.streetName,
      'address.city': house.address.city,
      'addedBy': { $ne: req.session.user._id }
    }) 
  
      res.redirect(`/houses?houseCount=${houseCount}`)
    }
  } catch (error) {
    console.error('There\'s an error while making API request:', error.message);
    res.redirect('/houses/new');
  }
}

async function show(req, res) {
  try {
    const house = await House.findById(req.params.houseId).populate('addedBy');
    const houseCount = req.query.houseCount;
    res.render('houses/show', {
      house, houseCount
    })
  } catch (error) {
    console.log(error);
    res.redirect('/houses')
    
  }
}

async function createReview(req, res) {
  try {
    const house = await House.findById(req.params.houseId);
    house.reviews = {
      notes : req.body.notes,
      rating: req.body.rating,
      visitedDate: req.body.visitedDate,
      reviewer : req.session.user._id,
    }
    await house.save();
    
    res.redirect(`/houses/${house._id}`);
  } catch (error) {
    console.log(error);
    res.redirect('/')
  }
}

async function deleteHouse(req, res) {
  try {
    await House.findByIdAndDelete(req.params.houseId);
    res.redirect('/houses')
  } catch (error) {
    console.log(error);
    res.redirect('/houses')
  }
}

async function edit(req, res) {
  try {
    const house = await House.findById(req.params.houseId);
    res.render('houses/edit', {
      house
    })
  } catch (error) {
    console.log(error);
    res.redirect('houses')
  }
}

async function update(req, res) {
  try {
    for (let key in req.body) {
      if (req.body[key] === "") delete req.body[key];
    }

    req.body.address = {
      streetName : req.body.streetName,
      apartmentNumber: req.body.apartmentNumber,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      zipCode: req.body.zipCode
    }
    
    const house = await House.findByIdAndUpdate(
      req.params.houseId, req.body, {new: true}
    )

    const houseCount= await House.countDocuments({
      'address.streetName': house.address.streetName,
      'address.city': house.address.city,
      'addedBy': { $ne: req.session.user._id }
    }) 
    
    res.redirect(`/houses/${house._id}?houseCount=${houseCount}`)
  } catch (error) {
    console.log(error);
    res.redirect('/houses');
  }
}

async function editReview(req, res) {
  try {
    const house = await House.findById(req.params.houseId);
    const editReview = true;
    if(house.reviews.reviewer.equals(req.session.user._id)){
      res.render('houses/show', {
        house,
        editReview
      })
    }
    else {
      throw new Error('Not authorized')
    }
    
  } catch (error) {
    console.log(err)
    res.redirect('/houses')
  }
}

async function updateReview(req, res) {
  try {
    console.log("Inside update review function");
    
    const house = await House.findById(req.params.houseId);
    console.log("Reviewer is:", house.reviews.reviewer);
    console.log("Full house object is:", house);
    
    
    if(house.reviews.reviewer.equals(req.session.user._id)){
      house.reviews.set(req.body)
      await house.save();
      console.log("Full house object after saving is", house);
      res.redirect(`/houses/${house._id}`)
    }
    else {
      throw new Error('Not authorized')
    }

  } catch (error) {
    console.log(error)
    res.redirect('/houses')
  }
}

export {
  index,
  newHouse as new,
  create,
  show,
  createReview,
  deleteHouse as delete,
  edit,
  update,
  editReview,
  updateReview
}

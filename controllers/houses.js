import { House } from "../models/house.js"

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
  res.render('houses/new.ejs');
}

async function create(req, res) {
  try {
    req.body.addedBy = req.session.user._id
    for (let key in req.body) {
      if (req.body[key] === "") delete req.body[key];
    }
    req.body.address = {
      streetName : req.body.streetName,
      apartmentNumber: req.body.apartmentNumber,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      zipCode: req.body.zipCode,
      neighborhood: req.body.neighborhood
    }

    const house = await House.create(req.body);
    const houseCount= await House.countDocuments({
      'address.neighborhood': house.address.neighborhood
    })
    
    /* if(countOfHouses){
      var notification = `There are ${countOfHouses-1} houses saved from this neighborhood already!`
      console.log(notification);
    } */
    
    res.redirect(`/houses?houseCount=${houseCount}`)
  } catch (error) {
    console.log(error);
    res.redirect('/houses/new');
  }
}

async function show(req, res) {
  try {
    const house = await House.findById(req.params.houseId).populate('addedBy');
    res.render('houses/show', {
      house
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

    console.log(req.body);
    const house = await House.findByIdAndUpdate(
      req.params.houseId, req.body, {new: true}
    )
    res.redirect(`/houses/${house._id}`)
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

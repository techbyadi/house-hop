import { House } from "../models/house.js"

async function index(req, res) {
  try {
    const houses = await House.find({}).populate('addedBy')
    res.render('houses/index', {
      houses
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

    const house = await House.create(req.body);
    console.log("house data", house);
    res.redirect('/houses')
  } catch (error) {
    console.log(error);
    res.redirect('/houses/new');
  }
}

async function show(req, res) {
  try {
    const house = await House.findById(req.params.houseId).populate(['addedBy', 'reviews.reviewer']);
    console.log(house);
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
    req.body.reviewer = req.session.user._id;
    house.reviews.push(req.body);
    await house.save();
    res.redirect(`/houses/${house._id}`);
  } catch (error) {
    console.log(error);
    res.redirect('/')
  }
}

export {
  index,
  newHouse as new,
  create,
  show,
  createReview
}

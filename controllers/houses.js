import { House } from "../models/house.js"
import { User } from "../models/user.js"

async function index(req, res) {
  const users = await User.find({})
  console.log(users);
  res.render('houses/index', {
    users
  })
}

export {
  index
}

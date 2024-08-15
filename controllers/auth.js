import bcrypt from 'bcrypt'
import { User } from '../models/user.js'

function newSignUp(req, res) {
  res.render('auth/sign-up')
}

async function signUp(req, res) {
  const userInDatabase = await User.findOne({ username: req.body.username })
  if (userInDatabase) {
    return res.send('Username already taken.')
  }
  if (req.body.password !== req.body.confirmPassword) {
    return res.send('Password and Confirm Password must match')
  }
  const hashedPassword = bcrypt.hashSync(req.body.password, 10)
  req.body.password = hashedPassword
  const user = await User.create(req.body)
  req.session.user = {
    username: user.username,
    _id: user._id,
    firstname: user.firstname,
    minPrice: user.minPrice,
    maxPrice: user.maxPrice
  }
    req.session.save(() => {
    res.redirect('/houses')
  })
}

function newSignIn(req, res) {
  res.render('auth/sign-in')
}

async function signIn(req, res) {
  const userInDatabase = await User.findOne({ username: req.body.username }).select('+password')
  if (!userInDatabase) {
    return res.send('Login failed. Please try again.')
  }
  const validPassword = bcrypt.compareSync(
    req.body.password,
    userInDatabase.password
  )
  if (!validPassword) {
    return res.send('Login failed. Please try again.')
  }
  req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id,
    firstname: userInDatabase.firstname,
    minPrice: userInDatabase.minPrice,
    maxPrice: userInDatabase.maxPrice
  }
  req.session.save(() => {
  res.redirect('/houses')
  })
}

function signOut(req, res) {
  req.session.destroy(() => {
    res.redirect('/')
  })
}

export {
  newSignUp,
  signUp,
  newSignIn,
  signIn,
  signOut
}
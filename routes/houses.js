import { Router } from 'express'
import { isSignedIn } from '../middleware/is-signed-in.js'
import * as usersCtrl from '../controllers/users.js'
import * as housesCtrl from '../controllers/houses.js'

const router = Router()

// public routes
//router.get('/:userId', usersCtrl.show)

// protected routes
//router.get('/', isSignedIn, usersCtrl.index)

//protected routes

router.get('/', isSignedIn, housesCtrl.index)

router.get('/new', isSignedIn, housesCtrl.new);

router.post('/', isSignedIn, housesCtrl.create);

//localhost:3000/houses/:houseId
router.get('/:houseId', isSignedIn, housesCtrl.show)

export { router }

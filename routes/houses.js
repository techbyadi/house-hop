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
router.get('/:houseId', isSignedIn, housesCtrl.show)

router.post('/', isSignedIn, housesCtrl.create);
router.post('/:houseId/reviews', isSignedIn, housesCtrl.createReview);


export { router }

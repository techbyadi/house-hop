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

export { router }

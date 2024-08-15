import { Router } from 'express'
import { isSignedIn } from '../middleware/is-signed-in.js'
import * as wishlistCtrl from '../controllers/wishlist.js'


const router = Router()

//protected routes
router.get('/', isSignedIn, wishlistCtrl.index)

export { router }

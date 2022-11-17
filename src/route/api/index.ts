import express from "express"

import signRoute from "src/route/api/sign"
import tokenRoute from "src/route/api/token"

const router = express.Router()

router.use("/sign", signRoute)
router.use("/token", tokenRoute)

export default router

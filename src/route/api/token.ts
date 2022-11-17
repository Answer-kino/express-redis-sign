import express from "express"
import tokenController from "src/controller/token"
import { refreshTokenHandler } from "src/middleware/tokenHandler"

const router = express.Router()

router.post("/refresh", refreshTokenHandler, tokenController.accessTokenReissue)

export default router

import ApiResponse from "src/utility/apiResponse"
import { IController } from "../@interface/IController"
import ApiError from "src/utility/apiError"
import TokenService from "src/service/token"
import redisService from "src/service/redis"
import JWT from "src/utility/jwt"

export default class tokenController {
  static accessTokenReissue: IController = async (req, res) => {
    try {
      const { idx, type } = req.rctInfo
      const { rct } = req.body

      let tokenInfo
      if (type === "User") {
        tokenInfo = await TokenService.user({ IDX_USER: idx })
      }
      if (type === "Admin") {
        tokenInfo = await TokenService.admin({ IDX_OPER: idx })
      }
      const act = JWT.createAccessToken(tokenInfo)
      const ttl = await redisService.getTTL(rct)

      await redisService.setExpire(rct, act, ttl)

      ApiResponse.send(res, { act })
    } catch (error: any) {
      console.log(error)
      ApiError.regist(error)
      ApiResponse.error(res, error)
    }
  }
}

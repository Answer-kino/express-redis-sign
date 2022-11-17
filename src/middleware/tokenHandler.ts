import { StatusCodes } from "http-status-codes"
import { IRctInfo } from "src/@interface/global/express"
import { IMiddleware } from "src/@interface/IMddleware"
import redisService from "src/service/redis"
import ApiError from "src/utility/apiError"
import ApiResponse from "src/utility/apiResponse"
import JWT from "src/utility/jwt"

/**
 * rct와 매핑되어 redis에 저장되어 있는 act 값을 비교하여 옳바른 값일 경우 rct 를 복호화 하여 반환합니다.
 * @redis key[rct] : value [act]
 * @body rct = RefreshToken
 * @headers act = AccessToken
 * @example
 * body : {
 *  "rct" : "{rct}"
 * }
 * headers : {
 *  "authorization" : "Bearer {act}"
 * }
 */
export const refreshTokenHandler: IMiddleware = async (req, res, next) => {
  try {
    const { rct } = req.body
    const act = JWT.getToken(req.headers)

    const curAct = await redisService.getVaule(rct)

    if (!curAct) {
      throw new ApiError("TOKEN_EXPIRE", StatusCodes.UNAUTHORIZED, `ERROR : RefreshToken is expire`)
    }
    if (curAct !== act) {
      throw new ApiError("TOKEN_INVALID", StatusCodes.UNAUTHORIZED, `ERROR : AccessToken is not math`)
    }
    const rctVerify: any = JWT.verifyToken(rct)

    let rctInfo: IRctInfo = {
      idx: rctVerify["IDX_USER"] ?? rctVerify["IDX_OPER"],
      type: rctVerify["IDX_USER"] ? "User" : "Admin",
    }

    req.rctInfo = rctInfo
    next()
  } catch (error) {
    console.error(error)
    ApiError.regist(error)
    ApiResponse.error(res, error)
  }
}

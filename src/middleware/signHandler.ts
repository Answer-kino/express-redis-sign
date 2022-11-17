import { StatusCodes } from "http-status-codes"
import { IMiddleware } from "src/@interface/IMddleware"
import redisService from "src/service/redis"
import ApiError from "src/utility/apiError"
import ApiResponse from "src/utility/apiResponse"
import { digitCode } from "src/utility/math"

/**
 * type 에 따른 키값을 설정 후 인증번호를 저장합니다.
 * @example
 * // email_kino@ianswer.co.kr
 * // phone_01012341234
 * const key = `${type}_${redisKey}`;
 */
export const setDisitCode: IMiddleware = async (req, res, next) => {
  try {
    const { type, redisKey } = req.body
    const code = digitCode(6)
    const key = `${type}_${redisKey}`

    const status = await redisService.setDisitCode(key, code)

    req.digitCode = { status: status === "OK", digitCode: code }
    next()
  } catch (error) {
    console.error(error)
    ApiError.regist(error)
    ApiResponse.error(res, error)
  }
}

export const getDisitCode: IMiddleware = async (req, res, next) => {
  try {
    const { type, redisKey } = req.body
    const key = `${type}_${redisKey}`

    const code = await redisService.getVaule(key)

    let status = true
    if (!code) {
      status = false
    }
    req.digitCode = { status, digitCode: code }
    next()
  } catch (error) {
    console.error(error)
    ApiError.regist(error)
    ApiResponse.error(res, error)
  }
}

/**
 * 인증절차를 확인 할 수 있게 JSON 형태로 데이터를 작성합니다.
 * @example
 * key:{
 *    "phone": false or true,
 *    "email": false or true
 * }
 */
export const setWhetherCertified: IMiddleware = async (req, res, next) => {
  try {
    const { redisKey } = req.body

    const code = await redisService.getVaule(redisKey)
    console.log(code)
    if (!code) {
      const whetherCertified = JSON.stringify({
        phone: false,
        email: false,
      })

      await redisService.setWhetherCertified(redisKey, whetherCertified)
    }

    next()
  } catch (error) {
    console.error(error)
    ApiError.regist(error)
    ApiResponse.error(res, error)
  }
}

/**
 * 회원 가입 하기 전 모든 인증절차를 거쳤는지 확인 합니다.
 */
export const checkWhetherCertified: IMiddleware = async (req, res, next) => {
  try {
    const { redisKey } = req.body

    const code = await redisService.getVaule(redisKey)
    const { phone, email } = JSON.parse(code)

    if (!phone) {
      throw new ApiError("FAIL_WHETHERCERTIFIED_CRETIFIED", StatusCodes.UNAUTHORIZED, `FAIL : Please verify your mobile.`)
    }

    if (!email) {
      throw new ApiError("FAIL_WHETHERCERTIFIED_CRETIFIED", StatusCodes.UNAUTHORIZED, `FAIL : Please verify your email.`)
    }

    next()
  } catch (error) {
    console.error(error)
    ApiError.regist(error)
    ApiResponse.error(res, error)
  }
}

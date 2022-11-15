import { compareSync, genSaltSync, hashSync } from "bcrypt"
import { StatusCodes } from "http-status-codes"
import { IController } from "src/@interface/IController"
import SignService from "src/service/user/sign"
import redisService from "src/service/redis"
import JWT from "src/utility/jwt"
import ApiResponse from "src/utility/apiResponse"
import ApiError from "src/utility/apiError"

export default class signController {
  /**
   * 휴대폰 인증번호 보내기
   */
  static sendPhoneDisitCode: IController = async (req, res) => {
    try {
      const { redisKey: phone } = req.body
      const { status, digitCode } = req.digitCode

      ApiResponse.init(res)
    } catch (error: any) {
      console.log(error)
      ApiError.regist(error)
      ApiResponse.error(res, error)
    }
  }

  /**
   * 인증번호 확인하기
   */
  static checkDisitCode: IController = async (req, res) => {
    try {
      const { type, redisKey, digitCode } = req.body
      const { status, digitCode: curDigitCode } = req.digitCode
      if (!status) {
        throw new ApiError("FAIL_WHETHERCERTIFIED_CRETIFIED", StatusCodes.UNAUTHORIZED, `FAIL : The verification code has timed out.`)
      }

      if (digitCode === curDigitCode) {
        const code = await redisService.getVaule(redisKey)
        let { phone, email } = JSON.parse(code)

        if (type === "phone") {
          if (phone) {
            throw new ApiError("FAIL_WHETHERCERTIFIED_CRETIFIED", StatusCodes.NO_CONTENT, `FAIL : Already certified.`)
          } else {
            phone = true
          }
        }
        if (type === "email") {
          if (email) {
            throw new ApiError("FAIL_WHETHERCERTIFIED_CRETIFIED", StatusCodes.NO_CONTENT, `FAIL : Already certified.`)
          } else {
            email = true
          }
        }

        const whetherCertified = JSON.stringify({
          phone,
          email,
        })

        await redisService.setWhetherCertified(redisKey, whetherCertified)
      }

      ApiResponse.result(res, StatusCodes.OK, { digitCode: digitCode === curDigitCode })
    } catch (error: any) {
      console.log(error)
      ApiError.regist(error)
      ApiResponse.error(res, error)
    }
  }

  /**
   * 회원가입
   */
  static signUp: IController = async (req, res) => {
    try {
      const { carNumber, email, pwd, phone } = req.body
      const salt = genSaltSync(10)
      const enPwd = hashSync(pwd, salt)
      const userInfo = { carNumber, email, pwd: enPwd, phone }

      const result = await SignService.signUp(userInfo)

      console.log(result)
      ApiResponse.send(res)
    } catch (error: any) {
      console.log(error)
      ApiError.regist(error)
      ApiResponse.error(res, error)
    }
  }

  /**
   * 로그인
   */
  static signin: IController = async (req, res) => {
    try {
      const { carNumber, pwd } = req.body

      const userInfo = await SignService.signIn({ carNumber })
      const { Pwd: userPwd, IDX_USER } = userInfo

      // 비밀번호 비교
      if (!compareSync(pwd, userPwd)) {
        throw new ApiError("LOGIN_WRONG_PASSWORD", StatusCodes.UNAUTHORIZED, `login : ${carNumber}, password mismatch`)
      }

      // 토큰 생성 (access, refesh)
      delete userInfo.Pwd
      const act = JWT.createAccessToken(userInfo)
      console.log("act:", act)
      const rct = JWT.createRefreshToken({ IDX_USER })
      console.log("rct:", rct)
      // redis 토큰 저장
      await redisService.setRefreshToken(rct, act)

      // token 반환
      ApiResponse.send(res, { rct, act })
    } catch (error: any) {
      console.log(error)
      ApiError.regist(error)
      ApiResponse.error(res, error)
    }
  }

  /**
   * 회원 정보 조회
   */
  static userInfo: IController = async (req, res) => {
    try {
      ApiResponse.init(res)
    } catch (error: any) {
      console.log(error)
      ApiError.regist(error)
      ApiResponse.error(res, error)
    }
  }

  /**
   * 회원 정보 수정
   */
  static modifyInfo: IController = async (req, res) => {
    try {
      ApiResponse.init(res)
    } catch (error: any) {
      console.log(error)
      ApiError.regist(error)
      ApiResponse.error(res, error)
    }
  }

  /**
   * 회원 패스워드 수정
   */
  static modifyPwd: IController = async (req, res) => {
    try {
      ApiResponse.init(res)
    } catch (error: any) {
      console.log(error)
      ApiError.regist(error)
      ApiResponse.error(res, error)
    }
  }
}

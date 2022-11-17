import { IncomingHttpHeaders } from "http"
import { StatusCodes } from "http-status-codes"
import { sign, verify } from "jsonwebtoken"
import { Definition } from "src/config/definition"
import ApiError from "./apiError"

export default class JWT {
  private static secretKey = Definition.jwt.secretKey
  private static accessTokenOption = Definition.jwt.accessTokenOption
  private static refreshTokenOption = Definition.jwt.refreshTokenOption

  static getToken(headers: IncomingHttpHeaders) {
    const { authorization }: any = headers
    const bearer = authorization?.split(" ")

    return bearer ? bearer[1] : null
  }

  static verifyToken(headers: IncomingHttpHeaders) {
    try {
      let token: any
      if (headers === undefined) return false
      if (typeof headers === "string") {
        token = headers
      }
      if (typeof headers === "object" && "authorization" in headers) {
        token = this.getToken(headers)
      }

      return verify(token, this.secretKey)
    } catch (error: any) {
      error = ApiError.regist(error)
      throw new ApiError(error.code, StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }
  }

  static createAccessToken(data: any) {
    try {
      return sign(data, this.secretKey, this.accessTokenOption)
    } catch (error: any) {
      error = ApiError.regist(error)
      throw new ApiError(error.code, StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }
  }

  static createRefreshToken(data: any) {
    try {
      return sign(data, this.secretKey, this.refreshTokenOption)
    } catch (error: any) {
      error = ApiError.regist(error)
      throw new ApiError(error.code, StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }
  }
}

import { Request } from "express"
import { IDigitCode, IRctInfo, IUserAuth } from "src/@interface/global/express"
export {}

declare global {
  namespace Express {
    interface Request {
      userAuth: IUserAuth
      digitCode: IDigitCode
      rctInfo: IRctInfo
    }
  }
}

import Express, { Request } from "express"
import { IDigitCode, IUserAuth } from "src/@interface/IGlobal"

export {}

declare global {
  namespace Express {
    interface Request {
      userAuth: IUserAuth
      digitCode: IDigitCode
    }
  }
}

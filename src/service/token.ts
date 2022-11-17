import { Definition } from "src/config/definition"
import DB from "src/utility/dbUtil"
const { name: dbName } = Definition.mysql

export default class TokenService {
  static user = async (data: any) => {
    const dql = "SELECT `IDX_USER`, `CarNumber`, `Email`, `Phone`, `ProfileImg`"
    const model = "FROM `tbUser`"
    const value = "WHERE `IDX_USER` = ?"
    const sql = [dql, model, value].join(" ")

    const userInfo = await DB.execute(dbName, sql, [data.IDX_USER])

    return userInfo[0]
  }

  static admin = async (data: any) => {
    const dql = "SELECT `IDX_OPER`, `ID`, `Name`, `Pwd`, `Phone`, `Tel`, `Email`, `Capital`, `ProfileImg`"
    const model = "FROM `tbOperator`"
    const value = "WHERE `IDX_OPER` = ?"
    const sql = [dql, model, value].join(" ")

    const adminInfo = await DB.execute(dbName, sql, [data.IDX_OPER])

    return adminInfo[0]
  }
}

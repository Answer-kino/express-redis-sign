import { Definition } from "src/config/definition"
import DB from "src/utility/dbUtil"
const { name: dbName } = Definition.mysql

export default class SignService {
  static signUp = async (data: any) => {
    const dml = "INSERT INTO `tbUser`"
    const model = "(`CarNumber`, `Email`, `Pwd`, `Phone`)"
    const value = "VALUES (?,?,?,?)"
    const sql = [dml, model, value].join(" ")

    return await DB.execute(dbName, sql, [data.carNumber, data.email, data.pwd, data.phone])
  }

  static signIn = async (data: any) => {
    const dql = "SELECT `Pwd`, `IDX_USER`, `CarNumber`, `Email`, `Phone`, `ProfileImg`"
    const model = "FROM `tbUser`"
    const value = "WHERE `CarNumber` = ?"
    const sql = [dql, model, value].join(" ")

    const userInfo = await DB.execute(dbName, sql, [data.carNumber])

    return userInfo[0]
  }
}

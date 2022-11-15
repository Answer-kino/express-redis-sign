import redisCli from "src/config/db/redis"
import { logger } from "src/config/logger"

export default class redisService {
  static setRefreshToken = async (key: string, value: any) => {
    logger.verbose(`SET ${key}, ${value}, { EX: ${86400 * 7} }`)
    return await redisCli.set(key, value, { EX: 86400 * 7 })
  }

  static setDisitCode = async (key: string, value: any) => {
    logger.verbose(`SET ${key}, ${value}, { EX: 180 }`)
    return await redisCli.set(key, value, { EX: 180 })
  }

  static setWhetherCertified = async (key: string, value: any) => {
    logger.verbose(`SET ${key}, ${value}, { EX: 3600 }`)
    return await redisCli.set(key, value, { EX: 3600 })
  }

  static setValue = async (key: any, value: any) => {
    return await redisCli.set(key, value)
  }

  static getVaule = async (key: any) => {
    return await redisCli.get(key)
  }

  static delete = async (key: any) => {
    await redisCli.del(key)
  }
}

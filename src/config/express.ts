import express from "express"
import path from "path"
import morgan from "morgan"
import YAML from "yamljs"
import swaggerUi from "swagger-ui-express"
import cors, { CorsOptions } from "cors"
import { Definition } from "src/config/definition"
import { logger, stream } from "src/config/logger"
import { StatusCodes } from "http-status-codes"

import indexRotuer from "src/route/index"
import apiRotuer from "src/route/api/index"

const app = express()
// const origin = Config.server.mode === "development" ? Config?.front.local : Config?.front.public;
/**
 * express JSON & URLENCODED
 */
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: false }))

/**
 * Cors
 */
const corsOption: CorsOptions = {
  // origin: origin,
  methods: "GET,POST",
  preflightContinue: true,
  maxAge: 3600,
  optionsSuccessStatus: StatusCodes.OK,
}
app.use(cors(corsOption))

/**
 * Logger [ morgan ]
 */
app.use(morgan("combined", { stream }))

/**
 * Route
 */
app.use("/", indexRotuer)
app.use("/api", apiRotuer)

/**
 * Swagger
 */
if (Definition.server.mode !== "production") {
  logger.info("Swagger On : /api-docs")
  const swaggerSpec = YAML.load(path.join(__dirname, "../../dist/swagger.yaml"))
  const swaggerOptions = { docExpansion: "none" }
  const swaggerUiOptions = { explorer: true }
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions, swaggerOptions))
}

export default app

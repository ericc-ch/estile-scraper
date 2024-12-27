import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { isLinux } from "std-env"

import { browser } from "./lib/browser"
import { search } from "./routes/search"

if (!isLinux) throw new Error("estile server is only supported on Linux")

const app = new Hono()
app.use(logger())
app.use("/api/*", cors())

app.get("/", (c) => {
  return c.text("estile server is running")
})

app.route("/api/search", search)

export default app

process.on("exit", () => {
  void browser.close()
})

import { serve } from "@hono/node-server"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"

import { browser } from "./lib/browser"
import { search } from "./routes/search/route"

const app = new Hono()
app.use(logger())
app.use("/api/*", cors())

app.get("/", (c) => {
  return c.text("estile server is running")
})

app.route("/api/search", search)

process.on("exit", () => {
  void browser.close()
})

serve(app, () => {
  console.log("estile server is running")
})

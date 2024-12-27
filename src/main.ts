import { serve } from "@hono/node-server"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"

import { recommendation } from "./routes/recommendation/route"
import { search } from "./routes/search/route"

const app = new Hono()
app.use(logger())
app.use("/api/*", cors())

app.get("/", (c) => {
  return c.text("estile server is running")
})

app.route("/api/search", search)
app.route("/api/recommendation", recommendation)

serve(app, () => {
  console.log("estile server is running")
})

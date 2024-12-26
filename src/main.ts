import * as cheerio from "cheerio"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { isLinux } from "std-env"

import { createContext } from "./lib/browser"
import { extractProductInfo } from "./lib/html/extract-product-info"
import { SELECTORS } from "./lib/vars/selectors"

if (!isLinux) throw new Error("estile server is only supported on Linux")

const app = new Hono()
app.use(logger())
app.use("/api/*", cors())

app.get("/", (c) => {
  return c.text("estile server is running")
})

app.post("/search", async (c) => {
  const body = await c.req.json<{ query: string }>()
  const query = body.query

  const context = await createContext()
  const page = await context.newPage()
  await page.goto("https://www.ebay.com/")

  await page.locator(SELECTORS.SEARCH_INPUT).fill(query)
  await page.keyboard.press("Enter")

  const searchResults = await page
    .locator(SELECTORS.SEARCH_RESULT_CONTAINER)
    .innerHTML()

  // const searchResults = await getMockResults()

  const $ = cheerio.load(searchResults)
  const itemElements = $(SELECTORS.SEARCH_RESULT_ITEMS)

  const products = itemElements
    .toArray()
    .map((element) => extractProductInfo($, element))

  console.log(products)

  return c.json({ data: products })
})

export default app

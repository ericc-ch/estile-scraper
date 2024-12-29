import * as cheerio from "cheerio"
import { Hono } from "hono"

import { createPage } from "~/lib/browser"
import { SELECTORS } from "~/lib/vars/selectors"

import { extractProductInfo } from "./extract-product-info"

export const search = new Hono()

search.post("/", async (c) => {
  const body = await c.req.json<{ query: string }>()
  const query = body.query

  const products = await searchEbay(query)

  return c.json({ data: products })
})

// URL Shape
// https://www.ebay.com/sch/i.html?_nkw=search&_sacat=0

async function searchEbay(query: string) {
  const baseURL = "https://www.ebay.com/sch/i.html"

  const url = new URL(baseURL)
  url.searchParams.set("_sacat", "0")
  url.searchParams.set("_nkw", query)

  const { page, cleanup } = await createPage()

  await page.goto(url.toString())

  // await page.locator(SELECTORS.SEARCH_INPUT).fill(query)
  // await page.keyboard.press("Enter")

  await page.waitForSelector(SELECTORS.MAIN_CONTENT)

  const searchResultsElement = page.locator(SELECTORS.MAIN_CONTENT)
  const outerHTML = await searchResultsElement.evaluate((el) => el.outerHTML)

  const $ = cheerio.load(outerHTML)
  const itemElements = $(SELECTORS.SEARCH_RESULT_ITEMS)

  const products = itemElements
    .toArray()
    .map((element) => extractProductInfo($, element))
    .filter((product) => product.id)

  await cleanup()

  return products
}

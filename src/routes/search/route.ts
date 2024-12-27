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

async function searchEbay(query: string) {
  const { page, cleanup } = await createPage()
  await page.goto("https://www.ebay.com")

  await page.locator(SELECTORS.SEARCH_INPUT).fill(query)
  await page.keyboard.press("Enter")

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

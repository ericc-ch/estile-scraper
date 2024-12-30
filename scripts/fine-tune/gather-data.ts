import * as cheerio from "cheerio"
import consola from "consola"
import fs from "node:fs"
import { isProduction } from "std-env"
import { Writer } from "steno"

import { chunk } from "~/lib/array"
import { createPage } from "~/lib/browser"
import { PATHS } from "~/lib/vars/paths"
import { SELECTORS } from "~/lib/vars/selectors"
import { searchEbay } from "~/routes/search/search-ebay"

import { CLOTHING_CATEGORIES } from "./clothing-categories"
import { arrayToCSV } from "./csv"

const categories =
  isProduction ? CLOTHING_CATEGORIES : CLOTHING_CATEGORIES.slice(0, 5)

const PICKED_COUNT = isProduction ? 10 : 5

// The reason why only 1 chunk size in production
// https://docs.brightdata.com/scraping-automation/scraping-browser/configuration#single-navigation-per-session
const CHUNK_SIZE = isProduction ? 1 : 5

if (!fs.existsSync(PATHS.FOLDER_OUTPUT_FINE_TUNE)) {
  fs.mkdirSync(PATHS.FOLDER_OUTPUT_FINE_TUNE, { recursive: true })
}

const data: Array<Array<string>> = []

for (const category of categories) {
  consola.start(`Gathering data for ${category}...`)

  const searchResults = await searchEbay(category)
  consola.info(`Gathered ${searchResults.length} results.`)

  consola.info(`Picking top ${PICKED_COUNT} results`)
  const sliced = searchResults.slice(0, PICKED_COUNT)
  const chunked = chunk(sliced, CHUNK_SIZE)

  const categoryData: Array<Array<string>> = []

  for (const chunk of chunked) {
    const promises = chunk.map(async (result) => {
      const { cleanup, page } = await createPage()

      consola.info(`Navigating to ${result.link}`)
      await page.goto(result.link)

      consola.info(`Getting item specifics for ${result.title}`)
      await page.waitForSelector(SELECTORS.ITEM_SPECIFICS)

      const itemSpecificsElement = page.locator(SELECTORS.ITEM_SPECIFICS)
      const outerHTML = await itemSpecificsElement.evaluate(
        (el) => el.outerHTML,
      )

      const $ = cheerio.load(outerHTML)

      const itemSpecifics = extractItemSpecifics($)
      const formattedItemSpecifics = formatItemSpecifics(itemSpecifics)

      const data = [category, formattedItemSpecifics, result.title]

      consola.info(`Closing page for ${result.title}`)
      await cleanup()

      return data
    })

    const chunkData = await Promise.all(promises)

    categoryData.push(...chunkData)
  }

  data.push(...categoryData)
}
const headers = ["Item Category", "Item Specifics", "Item Name"]

const csv = arrayToCSV(data, headers)

const file = new Writer(PATHS.RESULTS_FINE_TUNE)

consola.info(`Writing results to ${PATHS.RESULTS_FINE_TUNE}`)
await file.write(csv)

consola.success(`Done! Results written to ${PATHS.RESULTS_FINE_TUNE}`)

// Loop through each row containing labels and values
function extractItemSpecifics($: cheerio.Root): Record<string, string> {
  const label = $(SELECTORS.ITEM_SPECIFICS_LABEL).text().trim()
  const value = $(SELECTORS.ITEM_SPECIFICS_VALUE).text().trim()

  const itemSpecifics: Record<string, string> = {}

  if (label && value) {
    itemSpecifics[label] = value
  }

  return itemSpecifics
}

function formatItemSpecifics(itemSpecifics: Record<string, string>) {
  return Object.entries(itemSpecifics)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n")
}

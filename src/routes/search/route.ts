import { Hono } from "hono"

import { searchEbay } from "./search-ebay"

export const search = new Hono()

search.post("/", async (c) => {
  const body = await c.req.json<{ query: string }>()
  const query = body.query

  const products = await searchEbay(query)

  return c.json({ data: products })
})

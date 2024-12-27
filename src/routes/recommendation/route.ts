import { generateObject } from "ai"
import { Hono } from "hono"

import { getModel } from "./llm-instances"
import { PROMPT_RECOMMENDATION, type UserPromptOptions } from "./prompts"
import { schemaRecommendation } from "./schema"

export const recommendation = new Hono()

type RecommendationBody = UserPromptOptions

recommendation.post("/", async (c) => {
  const body = await c.req.json<RecommendationBody>()

  const { object } = await generateObject({
    model: getModel(),
    system: PROMPT_RECOMMENDATION.SYSTEM_PROMPT,
    prompt: PROMPT_RECOMMENDATION.formatUserPrompt(body),
    schema: schemaRecommendation,
  })

  return c.json({ data: object })
})

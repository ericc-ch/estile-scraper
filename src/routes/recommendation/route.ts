import { generateObject } from "ai"
import { Hono } from "hono"

import { ENV } from "~/lib/vars/env"

import { ollama } from "./llm-instances"
import { PROMPT_RECOMMENDATION, type UserPromptOptions } from "./prompts"
import { schemaRecommendation } from "./schema"

export const recommendation = new Hono()

type RecommendationBody = UserPromptOptions

recommendation.post("/", async (c) => {
  const body = await c.req.json<RecommendationBody>()

  const { object } = await generateObject({
    model: ollama(ENV.OLLAMA_MODEL),
    system: PROMPT_RECOMMENDATION.SYSTEM_PROMPT,
    prompt: PROMPT_RECOMMENDATION.formatUserPrompt(body),
    schema: schemaRecommendation,
  })

  return c.json({ data: object })
})

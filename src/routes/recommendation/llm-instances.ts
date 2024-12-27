import type { LanguageModelV1 } from "ai"

import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { Ollama } from "ollama"
import { createOllama } from "ollama-ai-provider"
import { isProduction } from "std-env"

import { ENV } from "~/lib/vars/env"

/**
 * Ollama instance using official SDK, not using Vercel AI SDK,
 * Use this if you want to have more control over the Ollama API.
 */
export const _ollama = new Ollama({
  host: ENV.OLLAMA_HOST,
})

export const ollama = createOllama({
  baseURL: ENV.OLLAMA_BASEURL,
})

export const gemini = createGoogleGenerativeAI({
  apiKey: ENV.GEMINI_API_KEY,
})

export const getModel = () => {
  let model: LanguageModelV1

  if (isProduction) {
    model = gemini(ENV.GEMINI_MODEL)
  } else {
    model = ollama(ENV.OLLAMA_MODEL)
  }

  return model
}

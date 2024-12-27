import { Ollama } from "ollama"
import { createOllama } from "ollama-ai-provider"

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

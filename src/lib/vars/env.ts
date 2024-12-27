import { getEnv } from "@echristian/env"

const OLLAMA_HOST = getEnv("OLLAMA_HOST", "http://localhost:11434")
const OLLAMA_MODEL = getEnv("OLLAMA_MODEL", "gemma2:2b-instruct-q6_K")
const OLLAMA_BASEURL = `${OLLAMA_HOST}/api`

export const ENV = {
  BROWSER_WS_ENDPOINT: getEnv("BROWSER_WS_ENDPOINT"),

  OLLAMA_HOST,
  OLLAMA_MODEL,
  OLLAMA_BASEURL,
}

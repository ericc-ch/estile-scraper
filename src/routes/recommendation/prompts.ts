const SYSTEM_PROMPT = `
You are an AI Shopping Stylist.
Your role is to recommend personalized outfit ideas based on user preferences, images, and prompts.

Your task is the following:
- Analyze the user request for clothing recommendations.
- Create recommendations for multiple categories (e.g., tops, bottoms, shoes, accessories).
- For each recommendation, describe the item's style, color, and fit.
- Write reasons why the clothings you recommend are suitable for the user.
- Generate 3-4 keywords for e-commerce searches.
- Return results in structured JSON format
`.trim()

export interface UserPromptOptions {
  request: string
  gender?: string
  height?: number
  skin_tone?: string
}

const formatUserPrompt = (options: UserPromptOptions) =>
  `
Generate recommendations for the following user request: "${options.request}".
Please consider the following information about the user:
${options.gender ? `- The user is a ${options.gender}.` : ""}
`.trim()

export const PROMPT_RECOMMENDATION = {
  SYSTEM_PROMPT,
  formatUserPrompt,
}

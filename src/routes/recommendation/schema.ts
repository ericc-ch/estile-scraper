import { z } from "zod"

export const schemaRecommendation = z
  .object({
    outfits: z.array(
      z.object({
        category: z.string().describe("Category of the clothing article."),
        description: z
          .string()
          .describe("Description of the clothing article."),
        reason: z
          .string()
          .describe(
            "Reason why the clothing article is suitable for the user.",
          ),
        keywords: z
          .string()
          .describe(
            "Keywords used to search the clothing article in e-commerce.",
          ),
      }),
    ),
  })
  .describe("Response schema.")

import { execa } from "execa"
import playwright from "playwright"

const { stdout } = await execa`which chromium`

export const browser = await playwright.chromium.launch({
  executablePath: stdout.trim(),
  headless: false,
})

export const createContext = async () => {
  const context = await browser.newContext(playwright.devices["Desktop Chrome"])
  return context
}

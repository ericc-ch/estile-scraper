import spawn from "nano-spawn"
import playwright from "playwright"
import { isLinux, isMacOS, isProduction, isWindows } from "std-env"

import { ENV } from "./vars/env"

let command: [string, Array<string>] = ["", []]

if (isLinux || isMacOS) command = ["which", ["chromium"]]
else if (isWindows) command = ["where", ["chromium"]]
else
  throw new Error(
    "Cannot determine chromium executable path. Please define it manually in src/lib/browser.ts",
  )

const { stdout } = await spawn(...command)

export const browser = await (isProduction ?
  playwright.chromium.connectOverCDP(ENV.BROWSER_WS_ENDPOINT)
: playwright.chromium.launch({
    executablePath: stdout.trim(),
    headless: false,
  }))

export const createContext = async () => {
  const context = await browser.newContext(playwright.devices["Desktop Chrome"])
  return context
}

export const createPage = async () => {
  let page: playwright.Page
  let cleanup: () => Promise<void>

  if (isProduction) {
    page = await browser.newPage()
    cleanup = () => page.close()
  } else {
    const context = await createContext()
    page = await context.newPage()
    cleanup = () => context.close()
  }

  return {
    page,
    cleanup,
  }
}

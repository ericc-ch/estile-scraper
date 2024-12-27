import spawn from "nano-spawn"
import playwright from "playwright"
import { isLinux, isMacOS, isProduction, isWindows } from "std-env"

import { ENV } from "./vars/env"

const createBrowser = async () => {
  if (isProduction) {
    return playwright.chromium.connectOverCDP(ENV.BROWSER_WS_ENDPOINT)
  } else {
    let command: [string, Array<string>] = ["", []]

    if (isLinux || isMacOS) command = ["which", ["chromium"]]
    else if (isWindows) command = ["where", ["chromium"]]
    else
      throw new Error(
        "Cannot determine chromium executable path. Please define it manually in src/lib/browser.ts",
      )

    const { stdout } = await spawn(...command)

    return playwright.chromium.launch({
      executablePath: stdout.trim(),
      headless: false,
    })
  }
}

export const createContext = async () => {
  const browser = await Browser.getInstance()
  const context = browser.newContext(playwright.devices["Desktop Chrome"])
  return context
}

export const createPage = async () => {
  let page: playwright.Page
  let cleanup: () => Promise<void>

  if (isProduction) {
    const browser = await Browser.getInstance()
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

// 1 minute
const TIMEOUT_DURATION = 60_000

// This is a singleton class
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Browser {
  static _instance: playwright.Browser | undefined
  static _idleTimeout: NodeJS.Timeout | undefined
  static _closing: Promise<void> | undefined

  constructor() {
    if (Browser._instance) {
      throw new Error("Use Browser.getInstance() instead of new.")
    }
  }

  static async getInstance(): Promise<playwright.Browser> {
    if (Browser._closing) {
      await Browser._closing
      Browser._closing = undefined
    }

    Browser.resetIdleTimeout()

    if (!Browser._instance) {
      Browser._instance = await createBrowser()
    }

    return Browser._instance
  }

  static resetIdleTimeout() {
    if (Browser._idleTimeout) {
      clearTimeout(Browser._idleTimeout)
    }

    Browser._idleTimeout = setTimeout(async () => {
      // This is the same as Promise<void>
      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
      const { promise, resolve } = Promise.withResolvers<void>()

      Browser._closing = promise

      await Browser._instance?.close()
      Browser._instance = undefined
      Browser._idleTimeout = undefined

      resolve()
    }, TIMEOUT_DURATION)
  }
}

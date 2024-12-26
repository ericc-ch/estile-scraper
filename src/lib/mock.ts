import { PATHS } from "./vars/paths"

export function getMockResults() {
  const file = Bun.file(PATHS.MOCK_RESULTS)
  return file.text()
}

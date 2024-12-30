import path from "pathe"

const FOLDER_MOCK = path.join(process.cwd(), "mocks")
const MOCK_RESULTS = path.join(FOLDER_MOCK, "results.html")

const FOLDER_OUTPUT = path.join(process.cwd(), "output")
const FOLDER_OUTPUT_FINE_TUNE = path.join(FOLDER_OUTPUT, "fine-tune")

const RESULTS_FINE_TUNE = path.join(FOLDER_OUTPUT_FINE_TUNE, "items.csv")

export const PATHS = {
  FOLDER_MOCK,
  MOCK_RESULTS,

  FOLDER_OUTPUT,
  FOLDER_OUTPUT_FINE_TUNE,

  RESULTS_FINE_TUNE,
}

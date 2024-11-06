import puppeteer from 'puppeteer'
import lighthouse from 'lighthouse'
import { harFromMessages } from 'chrome-har'

const CHROME_FLAGS = [
  '--headless',
  '--disable-gpu',
  '--enable-logging',
  '--disable-extensions',
  '--no-sandbox'
]

const LIGHTHOUSE_FLAGS = {
  logLevel: 'silent',
  output: 'json'
}

const ONLY_AUDITS = ['network-requests']

const buildChromeConfig = (args = CHROME_FLAGS) => ({
  headless: 'new',
  args
})

const buildLighthouseConfig = (audits = []) => ({
  extends: 'lighthouse:default',
  settings: {
    onlyAudits: [...ONLY_AUDITS, ...audits]
  }
})

// Get the HAR outta here!
export const blubber = async ({ url, audits, chromeArgs, logLevel, bindAddress } = {}) => {
  // Initialise Chrome (headless).
  const chromeOptions = buildChromeConfig(chromeArgs)
  if (bindAddress) {
    chromeOptions.bindAddress = bindAddress
  }
  const chrome = await puppeteer.launch(chromeOptions)

  const flags = {
    ...LIGHTHOUSE_FLAGS,
    port: new URL(chrome.wsEndpoint()).port
  }

  if (logLevel) {
    flags.logLevel = logLevel
  }

  const config = buildLighthouseConfig(audits)
  const runnerResult = await lighthouse(url, flags, config)
  await chrome.close()

  console.warn({runnerResult})

  // Report & DevTools logs.
  const {
    report,
    artifacts: {
      devtoolsLogs: { defaultPass }
    }
  } = runnerResult

  // HARro there sailor!
  const har = harFromMessages(defaultPass, {
    includeTextFromResponseBody: true
  })

  const outcome = { url, har }

  if (audits) {
    outcome.report = JSON.parse(report)
  }

  return outcome
}

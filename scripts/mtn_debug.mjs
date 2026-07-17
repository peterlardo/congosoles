import { chromium } from "playwright"

const EMAIL = "admin@congosoldes.cg"
const PASSWORD = "Demo@2025!"
const FIRST = "Congo"
const LAST = "Soldes"

async function main() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  console.log("1. Opening signup page...")
  await page.goto("https://momodeveloper.mtn.com/signup", { waitUntil: "networkidle", timeout: 30000 })
  await page.waitForTimeout(3000)

  // Dismiss terms popup
  const dismissBtn = page.locator('button:has-text("Dismiss"), button[data-dismiss="modal"]')
  if (await dismissBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    console.log("   Dismissing terms popup...")
    await dismissBtn.click()
    await page.waitForTimeout(1000)
  }

  // Fill form
  await page.locator('#email').fill(EMAIL)
  await page.locator('#password').fill(PASSWORD)
  await page.locator('#confirmPassword').fill(PASSWORD)
  await page.locator('#firstName').fill(FIRST)
  await page.locator('#lastName').fill(LAST)
  console.log("   Form filled")

  // Check for recaptcha iframe
  const captcha = page.frameLocator('iframe[src*="recaptcha"]')
  console.log(`   Captcha frames: ${await captcha.locator('*').count()}`)

  // Submit
  await page.locator('button[type="submit"]').click()
  await page.waitForTimeout(3000)

  // Get error messages
  const errors = await page.locator('.validation-summary-errors, .error, [role="alert"], .text-red, .text-danger').allTextContents()
  console.log("\nErrors found:", errors.length ? errors : "none visible")

  // Get full body text for debugging
  const body = await page.locator('body').textContent() || ""
  // Find error-like text
  const lines = body.split('\n').filter(l => l.includes('error') || l.includes('Error') || l.includes('required') || l.includes('invalid') || l.includes('captcha'))
  console.log("\nRelevant content:")
  lines.forEach(l => console.log(`   ${l.trim()}`))

  await browser.close()
}

main().catch(console.error)

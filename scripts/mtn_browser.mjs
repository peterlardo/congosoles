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
  await page.waitForTimeout(2000)

  // Dismiss terms popup if visible
  const dismissBtn = page.locator('button:has-text("Dismiss")')
  if (await dismissBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    console.log("   Dismissing terms popup...")
    await dismissBtn.click()
    await page.waitForTimeout(1000)
  }

  // Fill form fields
  console.log("2. Filling signup form...")
  const inputs = await page.locator('input').all()
  console.log(`   Found ${inputs.length} input fields`)

  for (const input of inputs) {
    const type = await input.getAttribute("type")
    const id = await input.getAttribute("id")
    const name = await input.getAttribute("name")
    console.log(`   Input: type=${type} id=${id} name=${name}`)
  }

  // Try to find and fill by placeholder/type
  const emailInput = page.locator('input[type="email"]')
  const passwordInput = page.locator('input[type="password"]')
  const textInputs = page.locator('input[type="text"]')

  const emailCount = await emailInput.count()
  const passCount = await passwordInput.count()
  const textCount = await textInputs.count()
  console.log(`   Email inputs: ${emailCount}, Password: ${passCount}, Text: ${textCount}`)

  if (emailCount > 0) {
    await emailInput.first().fill(EMAIL)
    console.log("   Filled email")
  }
  if (passCount > 0) {
    await passwordInput.first().fill(PASSWORD)
    if (passCount > 1) await passwordInput.nth(1).fill(PASSWORD)
    console.log("   Filled password")
  }

  // Try to fill text fields (first name, last name)
  for (let i = 0; i < textCount && i < 2; i++) {
    const val = i === 0 ? FIRST : LAST
    await textInputs.nth(i).fill(val)
  }
  if (textCount > 0) console.log(`   Filled ${Math.min(textCount, 2)} text fields`)

  // Check for terms checkbox
  const checkboxes = page.locator('input[type="checkbox"]')
  const cbCount = await checkboxes.count()
  console.log(`   Checkboxes: ${cbCount}`)
  for (let i = 0; i < cbCount; i++) {
    await checkboxes.nth(i).check()
    console.log(`   Checked checkbox ${i}`)
  }

  // Submit the form
  console.log("3. Submitting form...")
  const submitBtn = page.locator('button[type="submit"], button:has-text("Sign Up"), button:has-text("Create Account")')
  if (await submitBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await submitBtn.click()
    console.log("   Clicked submit")
  } else {
    // Try pressing Enter
    await page.keyboard.press("Enter")
    console.log("   Pressed Enter")
  }

  await page.waitForTimeout(3000)
  const url = page.url()
  console.log(`4. Current URL: ${url}`)
  console.log(`   Title: ${await page.title()}`)

  // Check for success/error messages
  const body = await page.locator('body').textContent()
  if (body.includes("error") || body.includes("Error")) {
    console.log("   Error found in page")
  }
  if (body.includes("verify") || body.includes("Verify") || body.includes("confirm")) {
    console.log("   Verification email sent!")
  }

  // If we got redirected to profile/signin, signup was successful
  if (url.includes("profile") || url.includes("signin") || !url.includes("signup")) {
    console.log("\n✓ SIGNUP SUCCESSFUL!")
    
    // Navigate to subscriptions page to get API keys
    console.log("\n5. Getting subscription keys...")
    await page.goto("https://momodeveloper.mtn.com/product-descriptions", { waitUntil: "networkidle" })
    await page.waitForTimeout(2000)
    
    const pageContent = await page.locator('body').textContent()
    console.log(`   Page content (first 500 chars): ${pageContent.substring(0, 500)}`)
    
    // Try to find subscription key on profile page
    await page.goto("https://momodeveloper.mtn.com/profile", { waitUntil: "networkidle" })
    await page.waitForTimeout(2000)
    
    const profileContent = await page.locator('body').textContent()
    console.log(`   Profile content (first 500 chars): ${profileContent.substring(0, 500)}`)
  }

  await page.screenshot({ path: "mtn_signup_result.png", fullPage: true })
  console.log("\nScreenshot saved to mtn_signup_result.png")
  await browser.close()
}

main().catch(err => {
  console.error("Error:", err.message)
  process.exit(1)
})

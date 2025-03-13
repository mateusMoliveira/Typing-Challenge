import { test, expect } from "@playwright/test"

test("challenge flow", async ({ page }) => {
  await page.goto("/")

  // Fill out the form
  await page.fill("#name", "John Doe")
  await page.fill("#phone", "1234567890")
  await page.fill("#email", "john@example.com")

  // Start the challenge
  await page.click('button:text("Start Challenge")')

  // Wait for the timer to appear
  await page.waitForSelector("text=Time left:")

  // Submit the challenge
  await page.click('button:text("Submit")')

  // Check for success modal
  await expect(page.locator("text=Challenge completed successfully!")).toBeVisible()

  // Close the modal
  await page.click('button:text("Close")')

  // Navigate to candidate page
  await page.click('button:text("View Candidate Info")')

  // Check candidate information
  await expect(page.locator("text=John Doe")).toBeVisible()
  await expect(page.locator("text=1234567890")).toBeVisible()
  await expect(page.locator("text=john@example.com")).toBeVisible()

  // Navigate back to challenge page
  await page.click('button:text("Back to Challenge")')

  // Check if we're back on the main page
  await expect(page.locator("text=Challenge Form")).toBeVisible()
})

test("challenge failure", async ({ page }) => {
  await page.goto("/")

  // Fill out the form
  await page.fill("#name", "Jane Doe")
  await page.fill("#phone", "9876543210")
  await page.fill("#email", "jane@example.com")

  // Start the challenge
  await page.click('button:text("Start Challenge")')

  // Wait for the timer to appear
  await page.waitForSelector("text=Time left:")

  // Wait for 16 seconds (1 second more than the challenge time)
  await page.waitForTimeout(16000)

  // Check for failure modal
  await expect(page.locator("text=Challenge failed!")).toBeVisible()
})
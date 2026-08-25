from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        try:
            browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium')
            page = browser.new_page()
            print("Navigating to http://localhost:3000/create...")
            page.goto("http://localhost:3000/create")
            page.wait_for_load_state('networkidle')
            
            print("Filling form...")
            page.fill("input[placeholder='Your Company Name']", "Acme Corp")
            page.fill("input[placeholder='you@company.com']", "billing@acme.com")
            page.fill("input[placeholder='Client or Company Name']", "Wayne Enterprises")
            page.fill("input[placeholder='client@example.com']", "bruce@wayne.com")
            
            page.fill("input[placeholder='Service or product description']", "Web Development")
            # The number inputs might not have placeholders, let's just use evaluate to set the first two
            page.evaluate('''() => {
                const nativeSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLInputElement.prototype, "value"
                ).set;
                const setReactValue = (el, val) => {
                    nativeSetter.call(el, val);
                    el.dispatchEvent(new Event("input",  { bubbles: true }));
                    el.dispatchEvent(new Event("change", { bubbles: true }));
                };
                const numbers = document.querySelectorAll("input[type=\\"number\\"]");
                if (numbers.length >= 2) {
                    setReactValue(numbers[0], "1");
                    setReactValue(numbers[1], "1000");
                }
            }''')
            
            # Find the submit button, it might be the last button
            page.screenshot(path="screenshot_filled.png")
            print("Clicking submit...")
            buttons = page.locator("button")
            # Usually the submit button is the last one or has specific text like 'Generate' or 'Save'
            # Let's click the last button
            count = buttons.count()
            if count > 0:
                buttons.nth(count - 1).click()
            
            page.wait_for_timeout(2000) # Wait for generation
            page.screenshot(path="screenshot_result.png")
            print("Success! Created invoice.")
            browser.close()
        except Exception as e:
            print("Error:", e)

if __name__ == "__main__":
    run()

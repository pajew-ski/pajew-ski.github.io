import time
from playwright.sync_api import sync_playwright

def verify_axioms_colors(page):
    # 1. Go to localhost
    page.goto("http://localhost:5173")

    # Wait for hydration
    time.sleep(2)

    # 2. Locate the Axioms section
    # The header is "Fundamentale Architektur"
    axioms_header = page.get_by_text("Fundamentale Architektur")
    axioms_header.scroll_into_view_if_needed()

    # Wait a bit for scroll animation
    time.sleep(1)

    # 3. Screenshot Light Mode
    page.screenshot(path="/home/jules/verification/axioms_light.png")
    print("Took Light Mode Screenshot")

    # 4. Toggle Dark Mode
    # The toggle is aria-label="Toggle theme"
    toggle_btn = page.get_by_label("Toggle theme")
    toggle_btn.click()

    # Wait for transition
    time.sleep(1)

    # 5. Screenshot Dark Mode
    page.screenshot(path="/home/jules/verification/axioms_dark.png")
    print("Took Dark Mode Screenshot")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        # Set viewport size to ensure good visibility
        page.set_viewport_size({"width": 1280, "height": 800})

        try:
            verify_axioms_colors(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

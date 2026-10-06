from playwright.sync_api import Page, expect, sync_playwright
import os

def test_pages(page: Page):
    index_path = os.path.abspath('out/index.html')
    page.goto(f"file://{index_path}")
    page.wait_for_timeout(2000)

    page.screenshot(path="/home/jules/verification/main_page_updated_translations.png")

    shortcut_btn = page.get_by_role("button", name="Shortcut Tutorial")
    if shortcut_btn.is_visible():
        shortcut_btn.click()
        page.wait_for_timeout(500)
        page.screenshot(path="/home/jules/verification/shortcut_tutorial_updated.png")

        close_btn = page.get_by_role("button", name="Close")
        if close_btn.is_visible():
            close_btn.click()
            page.wait_for_timeout(500)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_pages(page)
            print("Screenshots captured.")
        finally:
            browser.close()

from playwright.sync_api import sync_playwright

def verify_picker_updates():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Go to the picker page
        page.goto("http://localhost:8000/pages/picker.html")

        # Verify Performance Rules Section
        print("Verifying Performance Rules Section...")
        kpi_section = page.locator(".urgente-kpi")
        if kpi_section.is_visible():
            print("KPI Section found.")
            title = kpi_section.locator("h3").inner_text()
            if "NOVO PROCESSO E REGRAS DA EQUIPA" in title:
                print("KPI Title correct.")
            else:
                print(f"KPI Title mismatch: {title}")
        else:
            print("KPI Section NOT found.")

        # Verify Communication Module
        print("Verifying Communication Module...")
        comm_section = page.locator(".comunicacao-stock")
        if comm_section.is_visible():
            print("Communication Section found.")

            # Fill out the form
            page.fill("#cliente-tel", "912345678")
            page.fill("#artigos-falta", "Leite, Pão, Ovos")

            # Take a screenshot of the communication section specifically
            comm_section.screenshot(path="communication_module.png")
            print("Screenshot of communication module saved.")
        else:
            print("Communication Section NOT found.")

        # Take a full page screenshot to see both sections
        page.screenshot(path="full_page_picker.png", full_page=True)
        print("Full page screenshot saved.")

        browser.close()

if __name__ == "__main__":
    verify_picker_updates()

from playwright.sync_api import sync_playwright

def verify_logic():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Go to the picker page
        page.goto("http://localhost:8000/pages/picker.html")

        # Helper function to get the message
        # We'll intercept window.open to get the URL and extract the text

        def test_scenario(phone, qty, desc, expected_text_part):
            print(f"Testing Scenario: Qty={qty}, Desc='{desc}'...")

            # Reset by reloading
            page.reload()

            # Set inputs
            page.fill("#cliente-tel", phone)

            # Click plus button to reach desired quantity
            # Assuming starts at 1
            current_qty = 1
            while current_qty < qty:
                page.click("#qtd-plus")
                current_qty += 1

            page.fill("#artigo-nome", desc)

            # Intercept window.open
            with page.expect_popup() as popup_info:
                page.click("#btn-whatsapp")

            popup = popup_info.value
            url = popup.url

            # Decode URL
            import urllib.parse
            decoded_url = urllib.parse.unquote(url)

            # Normalize spaces (decoding might leave + or non-breaking spaces)
            decoded_url_normalized = decoded_url.replace('+', ' ')

            if expected_text_part in decoded_url_normalized:
                print(f"PASS: Message contains '{expected_text_part}'")
            else:
                # Debugging: show what was actually in the relevant part of the message
                # Updated regex to catch both "falta de stock de ..." and "falta de stock dos seguintes artigos: ..."
                import re
                match = re.search(r"falta de stock (?:dos seguintes artigos:|de) (.*?), peço", decoded_url_normalized)
                found = match.group(1) if match else "NOT FOUND"
                print(f"FAIL: Expected '{expected_text_part}', Found '{found}'. URL: {decoded_url_normalized}")

            popup.close()

        # Test Scenario A: Only Quantity (5), No Description -> "... falta de stock de 5 artigo(s)"
        test_scenario("912345678", 5, "", "falta de stock de 5 artigo(s)")

        # Test Scenario B: Quantity 10, Description "2 Bananas" -> "... falta de stock dos seguintes artigos: 2 Bananas"
        # The quantity 10 should be IGNORED
        test_scenario("912345678", 10, "2 Bananas", "falta de stock dos seguintes artigos: 2 Bananas")

        browser.close()

if __name__ == "__main__":
    verify_logic()

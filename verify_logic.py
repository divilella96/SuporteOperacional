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
                import re
                match = re.search(r"artigos:(.*?), peço", decoded_url_normalized)
                found = match.group(1) if match else "NOT FOUND"
                print(f"FAIL: Expected '{expected_text_part}', Found '{found}'. URL: {decoded_url_normalized}")

            popup.close()

        # Test Scenario A: Only Quantity (3), No Description -> "3 artigo(s)"
        # Note: WhatsApp link encoding might change spaces to +, so we check for substring carefully or decode properly
        test_scenario("912345678", 3, "", "3 artigo(s)")

        # Test Scenario B: Quantity 1, Description "Leite" -> "Leite" (no 1x)
        test_scenario("912345678", 1, "Leite", "artigos: Leite, peço")

        # Test Scenario C: Quantity 2, Description "Pão" -> "2x Pão"
        test_scenario("912345678", 2, "Pão", "2x Pão")

        browser.close()

if __name__ == "__main__":
    verify_logic()

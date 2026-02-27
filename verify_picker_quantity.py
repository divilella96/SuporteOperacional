from playwright.sync_api import sync_playwright

def verify_picker_quantity_update():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Go to the picker page
        page.goto("http://localhost:8000/pages/picker.html")

        # Verify Quantity Selector
        print("Verifying Quantity Selector...")
        qty_selector = page.locator(".quantity-selector")
        if qty_selector.is_visible():
            print("Quantity Selector found.")

            minus_btn = page.locator("#qtd-minus")
            plus_btn = page.locator("#qtd-plus")
            qty_input = page.locator("#artigo-qtd")

            # Initial value should be 1
            if qty_input.input_value() == "1":
                print("Initial quantity is 1.")
            else:
                print(f"Initial quantity mismatch: {qty_input.input_value()}")

            # Test Plus Button
            plus_btn.click()
            if qty_input.input_value() == "2":
                 print("Plus button works (1 -> 2).")
            else:
                 print(f"Plus button failed: {qty_input.input_value()}")

            # Test Minus Button
            minus_btn.click()
            if qty_input.input_value() == "1":
                 print("Minus button works (2 -> 1).")
            else:
                 print(f"Minus button failed: {qty_input.input_value()}")

            # Test Min Value (should stay 1)
            minus_btn.click()
            if qty_input.input_value() == "1":
                 print("Minus button min value constraint works.")
            else:
                 print(f"Minus button min constraint failed: {qty_input.input_value()}")

        else:
            print("Quantity Selector NOT found.")

        # Verify Form Inputs
        print("Verifying Form Inputs...")
        page.fill("#cliente-tel", "912345678")
        page.fill("#artigo-nome", "Iogurte Grego")

        # Take a screenshot of the updated communication section
        comm_section = page.locator(".comunicacao-stock")
        comm_section.screenshot(path="communication_module_quantity.png")
        print("Screenshot of communication module saved.")

        browser.close()

if __name__ == "__main__":
    verify_picker_quantity_update()

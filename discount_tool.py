# discount_tool.py

def calculate_discount(price, original_price):
    if original_price <= 0:
        return None
    
    discount = ((original_price - price) / original_price) * 100
    return round(discount)


def main():
    print("🔥 Discount Calculator Tool\n")

    try:
        price = float(input("Enter Selling Price (₹): "))
        original_price = float(input("Enter Original Price (₹): "))

        if price > original_price:
            print("\n❌ Error: Selling price cannot be greater than original price!")
            return

        discount = calculate_discount(price, original_price)

        if discount is None:
            print("\n❌ Invalid Original Price!")
            return

        print("\n✅ Result:")
        print(f"Discount: {discount}% OFF")

    except ValueError:
        print("\n❌ Invalid input! Please enter numbers only.")


if __name__ == "__main__":
    main()
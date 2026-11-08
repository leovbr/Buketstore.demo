# Buketstore.demo

Romantic Luxury florist storefront demo.

## Customer pages
- Homepage, shop/catalog, product detail, cart, checkout, about, contact, testimonials.
- Customer journey: catalog → product detail → cart → checkout → WhatsApp order confirmation.
- Checkout stores a local demo order before opening WhatsApp with the order summary.

## Admin demo
Open `admin/index.html` to manage:
- Products, prices, categories, stock, image URLs and featured status.
- Brand name, tagline, WhatsApp number, email, address and opening hours.
- Orders created in this browser and their demo statuses.
- Testimonials and publication moderation.

## Design
- Romantic Luxury: ivory, blush pink, burgundy and deep plum.
- Playfair Display + DM Sans typography.
- Responsive storefront and admin layout.

## Current data mode — important
This repository currently uses browser `localStorage` for demo data:
- `buketstore_products`
- `buketstore_cart`
- `buketstore_brand_settings`
- `buketstore_orders`
- `buketstore_testimonials`

This means data is local to the browser/device and is not synchronized between customers or admin devices. The demo admin is not protected by production authentication. Do not use this version to process real customer data or production orders.

## Planned production integration
- Dedicated Supabase project for Auth, Postgres, and Storage.
- Row Level Security for all exposed tables.
- Secure admin authorization; never expose service-role keys in frontend code.
- Cloud-backed catalog, settings, testimonials, and orders.
- Validate stock and order totals on the trusted backend before accepting an order.
- WhatsApp remains the customer communication and payment-coordination channel; payment is handled manually outside the website.

## Hosting
GitHub Pages can host the static demo. A production launch requires the Supabase integration and security work above.

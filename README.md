# Kansō Table — Premium Static Restaurant Web Application

A browser-only restaurant demonstration built exclusively with **HTML5, CSS3, and vanilla JavaScript (ES6+)**. There is no framework, build step, backend, database, payment processor, authentication server, or package installation.

## Run it

### Fastest option
Open `index.html` directly in a modern browser. This project intentionally uses classic deferred scripts rather than JavaScript ES modules so it remains compatible with `file://` usage in common browsers.

### Recommended local preview
For the most production-like behavior, you may serve the folder with any simple static server, for example VS Code Live Server or Python:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Folder architecture

- `index.html` and the other `.html` files are page shells.
- `css/variables.css` contains the theme/design tokens.
- `css/base.css`, `layout.css`, `components.css`, `pages.css`, `responsive.css` layer styles from general to page-specific.
- `js/config.js` is the central restaurant configuration and feature settings.
- `js/data/` contains editable menu, review, and offer datasets.
- `js/utils/` contains storage, validation, formatting, and notification helpers.
- `js/modules/` contains feature modules for navigation, theme, menu/filtering, cart, checkout, orders, reservations, profile, favorites, reviews, and demo admin.
- `js/app.js` is the small page-aware bootstrap layer.
- `assets/images/` contains local SVG fallbacks. Remote editorial images are intentionally easy to replace.

## Main features implemented

- Premium responsive homepage and Japanese editorial-inspired design system
- Sticky desktop/mobile navigation
- Light/dark theme persisted in localStorage
- Language selector with translated shared navigation (English, Hindi, Telugu)
- Dynamic menu from editable JavaScript data
- Search across dish name, ingredients, and description
- Combined category, cuisine, dietary, price, rating, spice, bestseller, chef-special, new, and availability filters
- Sorting by popularity, rating, and price
- Food detail modal, allergens, ingredients, preparation time, favorites, recent views
- Persistent favorites and locally derived recommendations
- Single persistent cart state, quantity management, special instructions, tax and coupon calculations
- Front-end-only checkout for takeaway, delivery, and dine-in
- Local order confirmation/history, repeat order, cancellation, and simulated statuses
- Reservation creation/history/cancellation with date/time validation
- Demo profile without password storage or security claims
- Sample loyalty points/tier display
- Local review creation/filter/sort/helpful interaction with sample-review labels
- About, cuisines, gallery, contact, FAQ, events/catering, and policies pages
- Optional unprotected demo admin dashboard with local menu overrides
- Demo-data reset control
- Responsive layouts, focus states, keyboard-operable controls, reduced-motion support, image fallbacks

## Customization

### Restaurant name, contact details, tax and settings
Edit `js/config.js`.

Key values include:
- `restaurant.name`
- `restaurant.phone`
- `restaurant.email`
- `restaurant.address`
- `taxRate`
- `deliveryFee`
- `categories`
- `cuisines`
- `reservation`
- `features`
- `languages`

The visible hardcoded brand text `Kansō Table` in shared navigation/footer and page editorial copy can also be replaced with your brand name. For a fully data-driven brand title, you can extend `NavigationModule` to read `RestaurantConfig.restaurant.name` everywhere.

### Colors and typography
Edit `css/variables.css`. The main design tokens are:
- `--bg`
- `--surface`
- `--text`
- `--burgundy`
- `--beige`
- `--font-serif`
- `--font-sans`
- radius, spacing, shadow, and transition tokens

### Menu items
Edit `js/data/menu-data.js`. Keep every `id` unique and stable. Supported fields include:
`id`, `name`, `description`, `image`, `price`, `category`, `cuisine`, `dietary`, `ingredients`, `spice`, `allergens`, `rating`, `reviews`, `bestseller`, `chefSpecial`, `isNew`, `available`, `discount`, `prepTime`, and `popularity`.

### Coupons and promotions
Edit `js/data/offers-data.js`. The cart supports percentage and fixed discounts, minimum subtotals, max discounts, active flags, and expiry dates.

### Images
Remote Unsplash image URLs are used as convenient placeholders. Replace `image` values in `menu-data.js` and the editorial image URLs in page HTML with local optimized files under `assets/images/` for an offline/production build. Broken images fall back to the included SVG placeholders.

### Feature flags
`js/config.js` includes a `features` object. In this version the flags are centralized for future integrations. To make a module disappear completely, remove its navigation/page exposure or add conditional rendering in `NavigationModule`/`App` using the relevant flag.

## Browser storage

All state is local to the current browser profile. The reusable `StorageUtil`:
- namespaces storage keys by application version
- performs safe JSON parsing
- falls back when storage is unavailable
- catches quota/storage errors
- supports a full demo-data reset

Do not store real passwords, payment details, secrets, or sensitive personal data in this static demo.

## Static limitations

This project intentionally does **not** provide:
- secure authentication or authorization
- shared accounts or cross-device synchronization
- real payment processing
- live table availability
- actual order delivery to restaurant staff
- real kitchen/courier tracking
- outbound email/contact submission
- verified/shared reviews
- secure admin access
- real analytics

These require server-side and/or external services.

## Future integration recommendations

When converting to a real application, keep the front-end modules and replace the local adapters with API services for authentication, menu/catalog, cart/order persistence, reservations, reviews, payment, notifications, and admin authorization. Avoid coupling page rendering directly to a specific backend so the existing UI remains maintainable.

## Testing checklist

- Open every navigation/footer link
- Search menu by dish and ingredient
- Combine multiple filters, then clear them
- Verify sorting
- Add/remove favorites and refresh
- Add items, change quantities, apply `WELCOME10`, and refresh
- Verify subtotal, discount, tax, delivery fee, and final total
- Complete each checkout order type
- Verify order history and repeat/cancel actions
- Create and cancel a reservation; verify past-date protection
- Submit a local review; filter/sort it
- Edit the local profile
- Toggle dark/light theme and refresh
- Change language and verify shared navigation changes
- Use the demo admin availability/delete/add controls
- Reset demo data
- Test narrow mobile and wide desktop layouts
- Navigate using only the keyboard
- Disable motion in OS/browser accessibility settings
- Temporarily break an image URL and verify the SVG fallback



## Demo Login / Account

The project includes `login.html` with local demonstration sign-in and profile registration. It is intentionally **not secure authentication**: no backend is connected, demo passphrases are never persisted, and only non-sensitive profile fields are stored in browser `localStorage`. Use sample data only.

The navigation automatically links signed-out visitors to Login and signed-in demo users to Profile.


### Login page visibility

The login page is available at `login.html`. On the homepage, use the visible **Login / Create profile** button in the hero or the **Open login page** account panel. The desktop navigation also shows an explicit **Login** button while signed out and **Profile** while signed in.

If an older demo profile was already stored in the browser, the navigation may show **Profile**. Sign out from the Profile page or use the Login link in the footer to reopen the login page.

# DevAstra – Digital Products SaaS

Modern SaaS web app for selling digital products (codebases, templates, projects) built with:

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Firebase Auth + Firestore
- Razorpay (payments)

## Core features

- **Authentication**: Email/password + Google via Firebase Auth, protected routes.
- **Product pages**: Home, products listing, product details.
- **Payments**: Razorpay checkout, order creation + signature verification.
- **Orders**: Store purchases in Firestore, show dashboard with history and totals.
- **Downloads**: Secure download route that checks purchases before redirecting.
- **UI/UX**: Dark theme, glassmorphism, gradients, smooth animations.

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n","client_email":"..."}
```

- The `FIREBASE_SERVICE_ACCOUNT_KEY` is the JSON for a Firebase service account (escape newlines in the private key).
- The public `NEXT_PUBLIC_*` vars are used on the client; the others are server‑only.

### 3. Firebase setup

1. Create a Firebase project.
2. Enable **Email/Password** and **Google** providers in Authentication.
3. Create a **Web app** and copy the config into the `NEXT_PUBLIC_FIREBASE_*` values.
4. Create a **service account** in Google Cloud → IAM & Admin → Service Accounts, generate a key, and paste its JSON into `FIREBASE_SERVICE_ACCOUNT_KEY`.
5. In Firestore, create a collection called `orders`. The app will add documents automatically.

### 4. Razorpay setup

1. Create a Razorpay account and get your **Key ID** and **Key Secret**.
2. Put them in `.env.local` as shown above.
3. Add allowed redirect URLs in Razorpay dashboard if needed.

### 5. Run the app

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Folder structure

- `src/app`
  - `page.tsx` – Home (hero + featured products)
  - `products/page.tsx` – Products grid
  - `products/[id]/page.tsx` – Product detail page
  - `auth/page.tsx` – Login / Signup
  - `dashboard/page.tsx` – User dashboard (purchase history + downloads)
  - `download/[productId]/route.ts` – Secure download route
  - `api/razorpay/order/route.ts` – Create Razorpay order
  - `api/razorpay/verify/route.ts` – Verify payment + save order
- `src/components`
  - `layout/Navbar.tsx` – Top navigation
  - `providers/Providers.tsx` – Global providers (auth)
  - `home/*` – Hero + featured products sections
  - `products/*` – Product grid, cards, detail view
  - `auth/*` – Auth context, panel, protected route
  - `dashboard/DashboardView.tsx` – Dashboard UI
  - `purchase/CheckoutButton.tsx` – Razorpay client integration
- `src/lib`
  - `firebase.ts` – Firebase client SDK init
  - `server-auth.ts` – Firebase Admin + ID token verification
  - `products.ts` – Static product catalog
  - `orders.ts` – Firestore helpers (server)
  - `orders-client.ts` – Firestore helpers (client)

## Production notes

- For **auth on API routes and downloads**, `getServerSession` verifies Firebase ID tokens via Firebase Admin.
- Client code should set an `idToken` cookie after login if you want strict server‑side checks; alternatively, you can adapt the API routes to accept `Authorization: Bearer <idToken>` headers.
- Razorpay checkout script is loaded once globally in `layout.tsx`.




git remote add origin https://github.com/devastra-dev/DevAstra.git
git branch -M main
git pull origin main --allow-unrelated-histories
git push -u origin main
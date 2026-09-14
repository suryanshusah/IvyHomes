# Ivy Homes Internship Assignment

This repository contains the solution to the Ivy Homes Software Engineering Internship assignment. The goal of this assignment was to build a functional web application on top of an API with flawed documentation, while simultaneously discovering and documenting the discrepancies between the actual API behavior and the provided documentation.

## AI Usage Disclosure
**I used Google Deepmind's Antigravity AI (AGY)** as an agentic coding assistant to help develop this project. Antigravity was used to rapidly test the API, implement the frontend React components, debug issues, and format the final `submission.json`. Using an LLM agent was actively encouraged by the assignment requirements ("You will use an LLM for this. We expect you to; we use them all day.") and allowed me to focus heavily on analyzing the data patterns and hypothesizing API behaviors.

## How to Run It

This project uses a standard Vite + React setup.

### Steps
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables. Create a `.env` file in the `frontend` folder with your API key:
   ```env
   VITE_API_KEY=IVY26-443A5D9C8FFC
   VITE_BASE_URL=https://solve.ivy.homes
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   The application will run on `http://localhost:5173`.

## How I Worked Out What to Distrust

I approached the documentation with high skepticism, treating the API responses as the ultimate source of truth. My process was:
1. **Initial Sweep:** I used my AI assistant to make simple requests to all documented endpoints. This immediately revealed glaring issues like 401 Unauthorized errors when using `api_key` as a query parameter (it actually needed an `X-API-Key` header) and `/auth/login` returning `access_token` instead of `token`.
2. **Pagination Discovery:** When fetching the second page of data, I noticed the results were identical to the first page. This led to the hypothesis that `page` was being ignored, and I tested standard pagination patterns until I found that `offset` and `limit` worked. I also discovered the hard limit of 50 per page when trying to request 200 items.
3. **Data Download & Local Analysis:** As suggested in the assignment, I wrote scripts to pull down all available records (`listings`, `rentals`, `projects`). By having the entire dataset locally, I could write verification scripts to test claims in the documentation.
4. **Validating Logic through Data:** 
   - I checked the claim "Inactive, expired and withdrawn listings are excluded server side" by inspecting the `is_live` boolean. I discovered hundreds of listings with `is_live: false`, meaning the API does *not* exclude them.
   - I compared the `total_listings` given in the projects endpoint with a manual count of listings mapped to each project, revealing that 317 projects had incorrect listing counts.
   - I noticed anomalies in `price_max` for projects where a value like 99.9 was listed for a project selling multi-crore properties. This made it obvious the unit was Lakhs, not raw Rupees.

## What I Checked That Turned Out to be Fine (Failed Hypotheses)

Not every suspicion turned out to be true. I spent time investigating several hypotheses that were disproven:
1. **Timezone Conversion:** Given the documentation's claim about "Z suffix, everywhere", I hypothesized that dates might be stored in UTC but represented as IST without conversion, throwing off the "last 7 days" calculation. However, testing the timestamps showed that the server accurately served IST with an explicit `+05:30` offset.
2. **Duplicate Listings:** I suspected that the same physical property might be heavily duplicated by different brokers (a common real estate issue). I grouped listings by coordinates, locality, and properties, but the `listing_id`s were genuinely globally unique with almost a perfect 1-to-1 mapping to distinct properties, matching the documentation's claim.
3. **Fraudulent Rentals:** Because there were fake sale listings, I hypothesized that rentals might also be polluted with fake or corrupt entries. I ran rigorous checks looking for impossible square footage to rent ratios or duplicate names, but the rental data was surprisingly clean and accurate.
4. **Broken Filters for Rentals:** Since the `listings` endpoint completely ignored `min_price` and `max_price`, I assumed the `rentals` endpoint would have the same broken filter logic. However, the `rentals` filtering logic functioned much closer to the documented spec.

## What I Would Do With Another Two Days

If I had more time, I would focus on:
1. **Robust Client-Side State Management:** Implement a proper state manager like Redux or Zustand to handle the complex client-side filtering needed to compensate for the API's ignored parameters. Right now, data is fetched and filtered loosely on the client side, which is functional but not strictly optimized.
2. **Data Cleanup Pipeline:** I would write a middleware layer for the API client that automatically sanitizes incoming data (e.g., stripping out `is_live === false` records, converting Lakhs to INR, recalculating project counts) so the UI components only ever deal with a clean, truthful data model.
3. **Enhanced Insights Dashboard:** The current analytics screen is basic. I would build rich, interactive charts (using Recharts or Chart.js) to visualize price trends by locality, average carpet area distributions, and project completion timelines, providing much deeper value to the end user.
4. **E2E Testing:** Given that the backend API has proven to be untrustworthy, I would write Cypress tests to ensure the frontend gracefully handles unexpected data shapes or missing fields.

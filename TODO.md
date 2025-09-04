## Approved Plan Implementation Steps

### 1. Setup Dependencies
- [ ] Install axios and cheerio for web scraping functionality

### 2. Create/Setup Core Files
- [ ] Create src/app/layout.tsx with basic Next.js layout and metadata
- [ ] Create src/app/page.tsx with form for IG/FB profile URL inputs and result display
- [ ] Create src/app/api/track-location/route.ts for server-side profile data fetching and location extraction

### 3. Fetch & Process Logic
- [ ] Implement Instagram profile data extraction (bio location, posts)
- [ ] Implement Facebook profile data extraction (profile info)
- [ ] Add URL validation and error handling for invalid profiles or private accounts

### 4. UI/UX Polish
- [ ] Style the main page with shadcn components (button, input, card)
- [ ] Add loading states and error messages
- [ ] Ensure responsive design for mobile/desktop

### 5. Image Processing (AUTOMATIC)
- [ ] **AUTOMATIC**: Process placeholder images (placehold.co URLs) → AI-generated images
  - This step executes automatically when placeholders are detected
  - No manual action required - system triggers automatically
  - Ensures all images are ready before testing

### 6. Build & Testing
- [ ] Build project with pnpm run build --no-lint
- [ ] Start server with pnpm start
- [ ] API testing with curl commands to validate endpoint functionality
- [ ] Integration testing for full user flow (form submission to results)
- [ ] Handle edge cases: invalid URLs, no location data, private profiles

### Notes
- Prioritize legal compliance: Add warnings about web scraping practices
- Maintain privacy focus: No data storage, server-side processing only
- Document any API limitations and potential errors
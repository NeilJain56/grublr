# RetroWeb – Surf the Past

A frontend-only web app that lets users explore random archived websites from 1996-2015 using the Wayback Machine API.

## Features

- Explore random snapshots of websites from the Internet's golden years (1996-2015)
- Sleek, dark-mode interface with retro styling and animations
- Time portal animation when loading sites
- Responsive design for all screen sizes
- No backend required - all logic runs in the browser

## Tech Stack

- React + TypeScript
- React Router for navigation
- Framer Motion for animations
- Tailwind CSS for styling
- Vite for development and building

## Deployment to Vercel

This project is configured for easy deployment to Vercel. Follow these steps to deploy:

### Option 1: Deploy with Vercel CLI

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from the project directory:
   ```bash
   vercel
   ```

4. Follow the prompts to complete the deployment.

### Option 2: Deploy via GitHub

1. Push your code to a GitHub repository.

2. Go to [Vercel Dashboard](https://vercel.com/dashboard).

3. Click "New Project".

4. Import your GitHub repository.

5. Configure the project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

6. Click "Deploy".

### Option 3: Deploy with Vercel Web Interface

1. Zip your project files (excluding node_modules and dist folders).

2. Go to [Vercel Dashboard](https://vercel.com/dashboard).

3. Click "New Project".

4. Drag and drop your zip file to the "Import Git Repository" section.

5. Configure as in Option 2.

6. Click "Deploy".

## Important Notes for Deployment

- The project includes a `vercel.json` configuration file that handles SPA routing and sets necessary security headers for iframe content.
- The Wayback Machine API is accessed directly from the browser, so no server-side code is needed.
- The domains.json file is included in the public directory and will be available at runtime.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Preview the production build:
   ```bash
   npm run preview
   ```

## Customization

- Add more domains to the `public/domains.json` file to expand the pool of websites that can be explored.
- Adjust the year range in the `getRandomDate` function in `src/utils/waybackApi.ts` to focus on different time periods.
- Modify the UI styling in the component files and `index.css` to change the look and feel.

## License

MIT
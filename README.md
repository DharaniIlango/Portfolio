# Dharani Ilango - Portfolio

Minimal, "Paddock" themed portfolio highlighting Enterprise Architecture, Data Analytics, and Incident Management.
Built with vanilla HTML, CSS, and JS.

## Local Development

1. Open Visual Studio Code.
2. Install the **Live Server** extension.
3. Open `index.html`, right-click, and select "Open with Live Server" to view changes in real-time.

## Deployment to Firebase Hosting (Google Ecosystem)

1. **Install Firebase CLI:**
   Open your terminal and run:

   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Google/Firebase:**

   ```bash
   firebase login
   ```

3. **Initialize the Project:**
   Navigate to your portfolio directory in the terminal and run:

   ```Bash
   firebase init hosting
   ```

   - Select "Create a new project" (or select an existing one from your Firebase Console).
   - What do you want to use as your public directory? (Type .)
   - Configure as a single-page app? (No)
   - Set up automatic builds and deploys with GitHub? (No)
   - Overwrite index.html? (No)

4. **Deploy to the World:**
   ```Bash
   firebase deploy
   ```
   Firebase will provide a live URL (e.g., https://your-project-id.web.app) where your world-class portfolio is now live.

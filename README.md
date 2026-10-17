# Alex Morgan Portfolio

A responsive, single-page portfolio for Alex Morgan, a full-stack developer. The site uses a botanical light theme and a near-black dark theme with lime and forest-green accents.

## Sections

- **Home:** introduction, availability, skills, experience highlights, and a profile dashboard with role, API preview, metrics, and core technologies
- **About:** background, experience counters, and working philosophy
- **Services:** platform architecture, full-stack applications, and performance work
- **Journey:** work history presented as an animated timeline
- **Approach:** delivery process and selected impact
- **Skills:** technology and craft areas
- **Projects:** selected project cards
- **Contact:** contact details, social links, and an email-draft form

## Features

- Responsive layouts for desktop, tablet, and mobile
- Light/dark theme toggle; the selected theme is saved in local storage
- Mobile navigation with accessible expanded-state reporting
- Scroll progress indicator and active-section navigation
- GSAP and ScrollTrigger entrance, scroll, counter, timeline, and ticker animations
- Vanilla Tilt interaction on the hero profile dashboard when supported
- Reduced-motion support and static fallbacks when animation libraries are unavailable
- Contact form opens the visitor's email client; it does not submit to a server
- SEO metadata and Person structured data

## Built With

- HTML5, CSS, and vanilla JavaScript
- Tailwind CSS via CDN for layout utilities
- GSAP and ScrollTrigger via CDN for motion
- Vanilla Tilt via CDN for the hero dashboard
- Inter from Google Fonts and Font Awesome icons

## Run Locally

Open `index.html` in a browser, or serve the project with a local development server such as VS Code Live Server. There is no build step.

The page loads several libraries, fonts, icons, and project images from external CDNs or image hosts, so those features require an internet connection.

## Main Files

- `index.html` — page structure, metadata, and external library references
- `styles.css` — theme tokens, responsive layouts, component styles, and motion preferences
- `script.js` — theme, navigation, scroll state, contact form, and animation behavior

## Contact Form

The contact form uses `mailto:alex.morgan@example.com` to prepare a message in the visitor's default email client. No form data is sent to or stored by a backend.

## License

No license file is included. Add one if you plan to share or publish the project.

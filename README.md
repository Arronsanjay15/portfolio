# Arron Sanjay | Portfolio

Personal portfolio for Arron Sanjay, an MCA student working across full-stack development and data analytics. It shows selected projects, skills, education and certifications, and makes it easy to get in touch.

## Features

- **Animated hero:** a drifting data-network canvas that reacts to the cursor, a word-by-word headline reveal, four layered project previews that tilt with the mouse, magnetic buttons, and a scrolling tech ticker.
- **Projects:** filter by type (All, Web apps, Data), click any screenshot to open a full-size viewer, and open live sites where available.
- **Skills:** a bento grid that animates in on scroll, with dock-style magnifying chips. Skills used in a project show a count; click one to filter the projects that use it.
- **Education and certifications:** a timeline, featured certifications, and the rest in a collapsible list.
- **Contact:** copy-to-clipboard email, LinkedIn link, and a message form that opens a pre-filled draft in the visitor's email app (no backend needed).
- **Polish:** scroll progress bar, active-section navigation, back-to-top button, responsive layout, skip link, visible keyboard focus, and full `prefers-reduced-motion` support.

## Tech stack

- [React](https://react.dev/) 19
- [Vite](https://vite.dev/) with `@vitejs/plugin-react`
- [lucide-react](https://lucide.dev/) icons
- Plain CSS (custom properties, no CSS framework)
- ESLint with the React Hooks and React Refresh plugins

## Getting started

```bash
# install dependencies
npm install

# start the dev server
npm run dev

# production build (outputs to dist/)
npm run build

# preview the production build locally
npm run preview

# lint
npm run lint
```

## Project structure

```text
.
├── public/
│   ├── Arron_Sanjay_Resume.pdf      # linked from the navbar and hero
│   ├── student_analysis.png         # or inside projects/ (both paths are tried)
│   └── projects/
│       ├── fitzone.png
│       ├── online examination.jpeg
│       ├── lab_booking.png
│       └── student_analysis.png
├── src/
│   ├── App.jsx                      # all sections and content data
│   ├── App.css                      # all component styles
│   ├── index.css                    # global reset
│   └── main.jsx                     # entry point
├── index.html                       # fonts, meta tags
├── eslint.config.js
├── vite.config.js
└── package.json
```

## Editing the content

All text lives in arrays and constants at the top of `src/App.jsx`, so you rarely need to touch the markup.

| What                          | Where in `App.jsx`                                  |
| ----------------------------- | --------------------------------------------------- |
| Email, LinkedIn, resume path  | `EMAIL`, `LINKEDIN`, `RESUME`                       |
| Hero headline                 | `HEADLINE`                                          |
| Scrolling tech strip          | `TICKER`                                            |
| Projects                      | `PROJECTS`                                          |
| Skills                        | `SKILLS`                                            |
| Certifications                | `FEATURED_CERTS`, `MORE_CERTS`                      |
| Navigation links              | `NAV`                                               |

### Adding a project

Add an object to `PROJECTS`:

```js
{
  title: 'Project name',
  kind: 'Short category',
  blurb: 'One-sentence summary.',
  points: ['Outcome one', 'Outcome two', 'Outcome three'],
  tags: ['React', 'Node.js'],
  img: '/projects/your-screenshot.png',
  cat: 'web',          // 'web' or 'data' (used by the filter buttons)
  bg: '#ffffff',       // letterbox color behind the screenshot in the hero
  alt: 'Describe the screenshot',
  url: 'display-url-for-the-browser-frame',
  live: 'https://...',   // optional: shows "View live site"
  repo: 'https://...',   // optional: shows "Source code"
}
```

Skill chips automatically link to any project whose title, category, summary, bullets or tags mention that skill.

## Design notes

- **Palette:** moss `#1e2719`, olive `#3f4a32`, paper `#f3eedf`, bone `#fbf8f0`, with wheat `#e3c77a` as the single accent. Colors are CSS variables at the top of `App.css`.
- **Typography:** [Fraunces](https://fonts.google.com/specimen/Fraunces) for headings and [DM Sans](https://fonts.google.com/specimen/DM+Sans) for body text, loaded from `index.html`.
- **Motion:** one orchestrated entrance in the hero, one entrance in the skills section, and motion that responds to the visitor's actions elsewhere.

### Fonts

Make sure `index.html` contains these inside `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,300..700&display=swap"
  rel="stylesheet"
/>
```

## Deployment

The site is a static build, so it works on any static host. On [Vercel](https://vercel.com/):

1. Push the repository to GitHub.
2. Import it in Vercel. The Vite framework preset is detected automatically.
3. Use the defaults: build command `npm run build`, output directory `dist`.

File names in `public/` are case-sensitive on Vercel, so `Student_Analysis.png` and `student_analysis.png` are different files.

## Accessibility

- Semantic landmarks, a skip link, and `aria-current` on the active nav link
- Visible `:focus-visible` rings on all interactive elements
- The screenshot viewer is a modal dialog: it moves focus to the close button and closes with Esc
- Decorative animation is hidden from assistive technology
- Animations are disabled for visitors who prefer reduced motion

## Contact

- Email: arronsanjay15@gmail.com
- LinkedIn: [Arron Sanjay](https://www.linkedin.com/in/arron-sanjay-732504353/)
# Top Ten Leaderboard

This is a small React application built with Vite that presents a 10-position leaderboard for Caro C.

## Setup

```bash
npm install
npm run dev
```

The development server runs on `http://localhost:5173` by default.

### Password protection

1. Duplicate `.env.example` to `.env`.
2. Update `VITE_SITE_PASSWORD` with the password you want visitors to enter.
3. Restart the dev server so Vite picks up the new environment variable.

The password is stored in the client bundle, so this gate is meant only for light access control (e.g. keeping casual visitors out during review).

## Notes

- Click any row to open a modal containing the position details and a placeholder image.
- The top three entries display gold, silver, and bronze dots next to the position number.
- Replace the placeholder image URL in `src/App.jsx` when you have the final photo.

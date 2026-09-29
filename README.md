# Web basics quiz (Next.js + Prisma + MySQL)

One project, one server. The React pages and the API routes (`app/api/*`) both run inside Next.js.

## Run it

1. Start MySQL (XAMPP Control Panel, click Start next to MySQL).
2. Check `.env`. It uses the XAMPP default (user `root`, no password). Edit it if yours is different.
3. In a terminal inside this folder:

       npm install
       npx prisma migrate dev --name init
       npx prisma db seed
       npm run dev

4. Open http://localhost:3000 (or the port Next prints, if 3000 is already used).

`npm install` also runs `prisma generate`. `migrate dev` creates the `quiz_next` database for you.

## Where things are

- `prisma/schema.prisma` has three tables: Question, Option, Attempt.
- `prisma/seed.ts` has the questions. Edit the `data` array and run `npx prisma db seed` again.
- `app/api/questions/route.ts` sends questions without the correct answers.
- `app/api/submit/route.ts` scores the answers on the server and saves an Attempt.
- `app/api/attempts/route.ts` returns the top 5 scores.
- `components/Quiz.tsx` is the whole UI. `app/globals.css` is the styling.

See the data in the browser with `npx prisma studio`.

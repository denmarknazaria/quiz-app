import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const data = [
  { text: "Which HTML tag holds the visible content of a page?", options: ["<head>", "<body>", "<meta>", "<title>"], correct: 1 },
  { text: "Which CSS property adds space outside an element's border?", options: ["padding", "margin", "border-spacing", "outline-offset"], correct: 1 },
  { text: "What does === check in JavaScript?", options: ["Value only", "Value and type", "Type only", "Memory address"], correct: 1 },
  { text: "Which HTTP method is normally used to create a new record?", options: ["GET", "POST", "DELETE", "HEAD"], correct: 1 },
  { text: "What does useState return in React?", options: ["A value and a setter function", "Only the current value", "A promise", "A DOM element"], correct: 0 },
  { text: "Which SQL keyword filters rows?", options: ["ORDER BY", "GROUP BY", "WHERE", "JOIN"], correct: 2 },
  { text: "Which command generates Prisma Client from schema.prisma?", options: ["npx prisma generate", "npx prisma studio", "npx prisma format", "npx prisma init"], correct: 0 },
  { text: "Which status code means Not Found?", options: ["200", "301", "404", "500"], correct: 2 },
  { text: "Which HTML attribute specifies an alternate text for an image?", options: ["src", "title", "alt", "href"], correct: 2 },
  { text: "Which CSS property is used to change text color?", options: ["text-color", "color", "font-color", "text-style"], correct: 1 },
  { text: "What is the primary language used for styling web pages?", options: ["HTML", "JavaScript", "CSS", "Python"], correct: 2 },
  { text: "Which data format is commonly used for data exchange in REST APIs?", options: ["XML", "JSON", "CSV", "YAML"], correct: 1 },
  { text: "Which Git command creates a new branch and switches to it?", options: ["git branch -n", "git checkout -b", "git new-branch", "git create"], correct: 1 },
  { text: "What does DOM stand for in Web Development?", options: ["Document Object Model", "Data Object Mode", "Digital Options Module", "Desktop Operating Method"], correct: 0 },
  { text: "Which hook in React is used for side effects like data fetching?", options: ["useContext", "useMemo", "useEffect", "useCallback"], correct: 2 },
];

async function main() {
  await prisma.question.deleteMany();
  for (const q of data) {
    await prisma.question.create({
      data: {
        text: q.text,
        options: { create: q.options.map((text, i) => ({ text, isCorrect: i === q.correct })) },
      },
    });
  }
}

main().finally(() => prisma.$disconnect());

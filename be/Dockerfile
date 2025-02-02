FROM oven/bun:1.2

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install

COPY . .

EXPOSE 3000
CMD ["bunx", "prisma", "generate", "&&", "bun", "run", "index.ts"]

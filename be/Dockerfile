FROM oven/bun:1.2

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install

COPY . .
RUN bunx prisma generate

EXPOSE 3000
CMD ["bun", "run", "index.ts", "--host", "0.0.0.0"]

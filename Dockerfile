FROM oven/bun:canary-alpine AS build
WORKDIR /app

COPY package.json bun.lock* ./

RUN bun install --frozen-lockfile --ignore-scripts

COPY . .

RUN bun run build

FROM oven/bun:canary-alpine AS production
WORKDIR /app

COPY --from=build /app/.output /app

EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "/app/server/index.mjs" ]

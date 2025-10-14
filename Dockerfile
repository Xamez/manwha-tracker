FROM node:24-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true
WORKDIR /app
RUN corepack enable


FROM base AS cache
COPY package.json pnpm-lock.yaml /app/
RUN pnpm install --frozen-lockfile


FROM base AS prod-deps
COPY --from=cache /app/node_modules /app/node_modules
COPY package.json pnpm-lock.yaml /app/


FROM base AS build
COPY package.json pnpm-lock.yaml /app/
COPY --from=cache /app/node_modules /app/node_modules
COPY . /app
RUN pnpm run build


FROM base
RUN groupadd --gid 1000 nodejs \
    && useradd --uid 1000 --gid 1000 --shell /bin/bash --create-home nodejs
USER nodejs

COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/.output /app/.output
COPY package.json /app/

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
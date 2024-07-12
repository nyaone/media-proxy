FROM node:20-alpine AS base

RUN npm install -g pnpm

FROM base AS BUILDER

WORKDIR /mp

COPY ["package.json", "pnpm-lock.yaml", "./"]

RUN pnpm i --frozen-lockfile

COPY . ./

RUN pnpm build

FROM base AS RUNNER

ENV NODE_ENV=production

WORKDIR /mp

COPY --from=builder /mp/built ./built
COPY --from=builder /mp/package.json ./package.json
COPY --from=builder /mp/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm i --frozen-lockfile

COPY --from=builder /mp/server.js ./server.js
COPY --from=builder /mp/config.js ./config.js

RUN echo {} > config.json

EXPOSE 3000

CMD ["pnpm", "run", "start"]

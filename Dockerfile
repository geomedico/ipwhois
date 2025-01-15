FROM node:20.17-slim
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 3000

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
RUN adduser --disabled-password appuser && chown -R appuser /usr/src/app
USER appuser

CMD ["pnpm", "start"]

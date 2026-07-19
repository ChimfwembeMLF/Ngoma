FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json yarn.lock* ./
RUN yarn install || true

FROM base AS runner
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 5173
CMD ["yarn", "dev", "--host", "0.0.0.0"]

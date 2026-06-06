FROM node:20-bookworm-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-bookworm-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables dummy solo para que Next.js pueda buildear sin DB real
ENV DATABASE_URL="file:/tmp/build.db"
ENV JWT_SECRET="build-placeholder-not-used-in-production"
ENV NEXTAUTH_SECRET="build-placeholder-not-used-in-production"
ENV NEXTAUTH_URL="http://localhost:3000"
ENV NEXT_PUBLIC_APP_URL="http://localhost:3000"
ENV NEXT_PUBLIC_MP_ALIAS="figus4198"
ENV NEXT_PUBLIC_PICKUP_ADDRESS="Mayorga 1590, San Rafael, Mendoza"
ENV NEXT_PUBLIC_PICKUP_HOURS="9 a 21 hs"

RUN npx prisma generate
RUN npx prisma db push
RUN npm run build

FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/@libsql ./node_modules/@libsql
COPY --from=builder /app/node_modules/dotenv ./node_modules/dotenv

RUN mkdir -p /data && chown nextjs:nodejs /data
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

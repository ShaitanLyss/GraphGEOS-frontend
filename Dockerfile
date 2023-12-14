# Build stage
FROM node:21-slim AS base
WORKDIR /app
RUN --mount=type=secret,id=certificate if [ -f "/run/secrets/certificate" ] ; then npm config set cafile /run/secrets/certificate ; fi

# Install dependencies and build
COPY package.json pnpm-lock.yaml ./
# Set yarn certificate
# RUN yarn config list
RUN npm config set strict-ssl false
RUN --mount=type=secret,id=certificate npm --global install pnpm

FROM base as dev-deps
RUN --mount=type=secret,id=certificate pnpm install

FROM base as prod-deps
RUN --mount=type=secret,id=certificate pnpm install --production --ignore-scripts

FROM dev-deps AS dev
COPY . .
ENV PUBLIC_ENABLE_AUTH true
CMD ["pnpm", "dev", "--host"]

FROM dev-deps AS build
COPY . .
ENV PUBLIC_ENABLE_AUTH true
RUN pnpm build

# Production stage
FROM gcr.io/distroless/nodejs20-debian12 AS production
WORKDIR /app
COPY --from=build /app/build .
COPY --from=prod-deps /app/node_modules ./node_modules
COPY config ./config
COPY package.json ./
CMD ["/app"]
EXPOSE 3000
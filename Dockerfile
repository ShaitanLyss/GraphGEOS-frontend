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
# RUN pnpm config set "//registry.npmjs.org/:_authToken" "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"
# RUN npm config list
# RUN pnpm config list
RUN --mount=type=secret,id=certificate pnpm install

COPY . .
# COPY .svelte-kit/tsconfig.json .svelte-kit/tsconfig.json

FROM base AS dev
CMD ["pnpm", "dev", "--host"]

FROM base AS build
RUN pnpm build

# Production stage
FROM caddy:2 AS production
ENV PUBLIC_ENABLE_AUTH true
# RUN apk update && apk upgrade

# Copy the build output to replace the default Caddyfile and serve with Caddy
COPY --from=build /app/build /usr/share/caddy

# Optional: If you have a custom Caddyfile, you can copy it here
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80 443

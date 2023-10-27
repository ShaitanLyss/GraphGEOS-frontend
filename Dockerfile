# Build stage
FROM node:21-slim AS base
WORKDIR /app
RUN --mount=type=secret,id=certificate if [ -f "/run/secrets/certificate" ] ; then yarn config set cafile /run/secrets/certificate ; fi

# Install dependencies and build
COPY package.json yarn.lock ./
# Set yarn certificate
RUN --mount=type=secret,id=certificate yarn install
COPY . .

FROM base AS dev
CMD ["yarn", "dev", "--host"]

FROM base AS build
RUN yarn build

# Production stage
FROM caddy:2 AS production
RUN apk update && apk upgrade -y

# Copy the build output to replace the default Caddyfile and serve with Caddy
COPY --from=build /app/build /usr/share/caddy

# Optional: If you have a custom Caddyfile, you can copy it here
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80

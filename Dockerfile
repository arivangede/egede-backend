FROM node:20-alpine As production

# Install necessary dependencies for Chromium
RUN apk update && apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    dumb-init

# Set environment variables for Puppeteer to use Chromium
ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /usr/src/app

COPY --chown=node:node ./node_modules ./node_modules
# COPY --chown=node:node ./dist ./dist

USER node

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD [ "node", "dist/main.js" ]

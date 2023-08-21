FROM node:14.18 As development

WORKDIR /usr/src/app

# manually installing chrome
# RUN apt-get update && apt-get install chromium -y


# skips puppeteer installing chrome and points to correct binary
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser


COPY ./api/package.json ./api/yarn.lock ./api/
COPY global ./global

COPY ./api ./api/

WORKDIR /usr/src/app/api


RUN yarn install --pure-lockfile --non-interactive  --ignore-engines --force  --network-timeout 1000000000


RUN yarn prisma generate

RUN yarn build

FROM node:14.18-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY ./api/package.json ./api/package.json
COPY global ./global

RUN yarn --production

COPY ./api ./api/

CMD ["node", "dist/src/main"]
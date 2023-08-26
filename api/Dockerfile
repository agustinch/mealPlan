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

FROM --platform=linux/amd64 node:14.18-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Copy package.json and yarn.lock to the container
COPY ./api/package.json ./api/yarn.lock ./api/
COPY ./global ./global

# Copy the rest of the application code to the container
COPY ./api ./api/

WORKDIR /usr/src/app/api

RUN yarn install

# Build the NestJS application
RUN yarn build

# Expose the port your NestJS app is listening on
EXPOSE 5000

# Command to start your NestJS app
CMD ["yarn", "start:prod"]
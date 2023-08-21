FROM node:14.18 As development

WORKDIR /usr/src/app

# manually installing chrome
# RUN apt-get update && apt-get install chromium -y


# skips puppeteer installing chrome and points to correct binary
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser


COPY ./client/package.json ./client/yarn.lock ./client/
COPY global ./global

COPY ./client ./client/

WORKDIR /usr/src/app/client


RUN yarn install --pure-lockfile --non-interactive  --ignore-engines --force --network-timeout 1000000000

EXPOSE 5000
CMD ["yarn", "dev"]


FROM node:14.18 As production

WORKDIR /usr/src/app

# manually installing chrome
# RUN apt-get update && apt-get install chromium -y


# skips puppeteer installing chrome and points to correct binary
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser


COPY ./client/package.json ./client/yarn.lock ./client/
COPY global ./global

COPY ./client ./client/

WORKDIR /usr/src/app/client
RUN yarn install --pure-lockfile --non-interactive  --ignore-engines --force --network-timeout 1000000000
EXPOSE 5000

CMD ["yarn", "build"]
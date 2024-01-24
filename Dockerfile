FROM node:21 as builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY packages/server/package*.json ./packages/server/

RUN npm install

COPY packages/shared ./packages/shared
COPY packages/server ./packages/server

RUN npm run build:server

FROM node:21 as production
ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY packages/server/package*.json ./packages/server/
RUN npm install
COPY --from=builder /usr/src/app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /usr/src/app/packages/server/dist ./packages/server/dist

EXPOSE 4000
CMD ["node", "packages/server/dist/index.js"]


FROM node:16-buster-slim

WORKDIR /app
ARG STAGE
ENV STAGE=${STAGE}

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
COPY tsconfig.json /app/tsconfig.json
COPY .env /app/.env
COPY src/ /app/src

RUN  npm i && npm run build

CMD ["npm", "start"]
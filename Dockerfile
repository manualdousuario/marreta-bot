FROM node:20

RUN mkdir /app
COPY . /app

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

WORKDIR /app

RUN npm ci
RUN npm run build

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

WORKDIR /.next/standalone/
CMD ["node", "server.js"]

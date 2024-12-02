FROM node:20

RUN apt-get update && apt-get install -y cron curl

RUN mkdir /app
COPY . /app

COPY cronjob.sh /app/
COPY crontab /etc/cron.d/api-check
RUN chmod +x /app/cronjob.sh
RUN chmod 0644 /etc/cron.d/api-check
RUN crontab /etc/cron.d/api-check

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

WORKDIR /app

RUN npm ci
RUN npm run build

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

CMD ["node", ".next/standalone/server.js"]
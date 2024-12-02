#!/bin/sh
echo "[$(date)] Running cron job"
curl -s -H "Authorization: Bearer $CRON_SECRET" "http://marreta-bot:3000/api/check"
echo ""
echo "[$(date)] Cron job completed"

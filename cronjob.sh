#!/bin/sh
echo "[$(date)] Running cron job"
curl -s -H "Authorization: Bearer $CRON_SECRET" "http://localhost:3000/api/check"
echo "[$(date)] Cron job completed"

#!/bin/sh

# Verificar variáveis de ambiente obrigatórias
if [ -z "$BLUESKY_USERNAME" ]; then
    echo "Erro: BLUESKY_USERNAME não está definido"
    exit 1
fi

if [ -z "$BLUESKY_PASSWORD" ]; then
    echo "Erro: BLUESKY_PASSWORD não está definido"
    exit 1
fi

if [ -z "$CRON_SECRET" ]; then
    echo "Erro: CRON_SECRET não está definido"
    exit 1
fi

# Para o cron conseguir pegar o valor do SECRET
env | grep CRON_SECRET > /etc/environment
chmod 644 /etc/environment

# Iniciar o cron
service cron start

# Executar comando principal do Next.js server
exec "$@"

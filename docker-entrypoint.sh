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

# Se todas as variáveis estiverem definidas, inicia a aplicação
exec "$@"

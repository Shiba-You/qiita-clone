#!/bin/sh

# デフォルトを dev とする
SCRIPT="dev"

# NODE_ENV によってスクリプト名を切り替える
if [ "$NODE_ENV" = "production" ]; then
  SCRIPT="npm run build:production"
elif [ "$NODE_ENV" = "staging" ]; then
  SCRIPT="npm run dev:staging -- --host"
fi

echo "Running: $SCRIPT"
exec "$SCRIPT"

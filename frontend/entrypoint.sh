#!/bin/sh

# デフォルトを dev とする
SCRIPT="dev"

# NODE_ENV によってスクリプト名を切り替える
if [ "$NODE_ENV" = "prod" ]; then
  SCRIPT="npm run build:prod"
elif [ "$NODE_ENV" = "dev" ]; then
  SCRIPT="npm run dev:dev -- --host"
fi

echo "Running: $SCRIPT"
$SCRIPT

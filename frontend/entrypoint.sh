#!/bin/sh

# デフォルトを dev とする
SCRIPT="dev"

# NODE_ENV によってスクリプト名を切り替える
if [ "$NODE_ENV" = "production" ]; then
  SCRIPT="build:production"
elif [ "$NODE_ENV" = "staging" ]; then
  SCRIPT="dev:staging"
fi

echo "Running: npm run $SCRIPT -- --host"
exec npm run "$SCRIPT" -- --host

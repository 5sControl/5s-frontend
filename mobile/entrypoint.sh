#!/bin/sh

if [ -z "$VITE_API_BASE_URL" ]; then
  echo "Error: VITE_API_BASE_URL is not set."
  exit 1
fi

echo "Replacing VITE_API_BASE_URL with: $VITE_API_BASE_URL"

find /usr/share/nginx/html -type f -exec sed -i "s|__VITE_API_BASE_URL__|$VITE_API_BASE_URL|g" {} \;

nginx -g "daemon off;"
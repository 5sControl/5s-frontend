#!/bin/sh

if [ -z "$VITE_API_BASE_URL" ]; then
  echo "Error: VITE_API_BASE_URL is not set."
  exit 1
fi

if [ -z "$APP_VERSION" ]; then
  echo "Error: APP_VERSION is not set."
  exit 1
fi

echo "Replacing VITE_API_BASE_URL with: $VITE_API_BASE_URL"
echo "Replacing APP_VERSION with: $APP_VERSION"

find /usr/share/nginx/html -type f -exec sed -i "s|__VITE_API_BASE_URL__|$VITE_API_BASE_URL|g" {} \;
find /usr/share/nginx/html -type f -exec sed -i "s|__APP_VERSION__|$APP_VERSION|g" {} \;

nginx -g "daemon off;"
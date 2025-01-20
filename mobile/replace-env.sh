#!/bin/sh

if [ -z "$APP_ENV_PREFIX" ]; then
    echo "APP_ENV_PREFIX is not set. Exiting."
    exit 1
fi

echo env;

for i in $(env | grep "^$APP_ENV_PREFIX"); do
    key=$(echo "$i" | cut -d '=' -f 1)
    value=$(echo "$i" | cut -d '=' -f 2-)

    echo "Replacing $key with $value"

    # Замена в файлах, где находятся ваши скомпилированные Vite-ресурсы
    find "/usr/share/nginx/html" -type f -exec sed -i 's|'"${key}"'|'"${value}"'|g' {} \;
done
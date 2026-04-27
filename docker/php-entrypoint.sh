#!/bin/sh

set -e

echo "Fixing Laravel permissions..."

chown -R laravel:laravel /var/www/html || true
chmod -R 775 /var/www/html/storage || true
chmod -R 775 /var/www/html/bootstrap/cache || true

echo "Starting PHP-FPM..."

exec docker-php-entrypoint php-fpm
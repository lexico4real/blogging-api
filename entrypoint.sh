#!/bin/sh

until nc -z -v -w30 db 5432
do
  echo "Waiting for database connection..."
  sleep 1
done

echo "Database is up - executing command"

npx prisma init

npx prisma migrate deploy

npm run start:dev

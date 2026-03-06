#!/bin/sh
set -e

echo "Waiting for database..."
for i in $(seq 1 30); do
  if node -e "const{Pool}=require('pg');const p=new Pool({connectionString:process.env.DATABASE_URL});p.query('SELECT 1').then(()=>{p.end();process.exit(0)}).catch(()=>process.exit(1))" 2>/dev/null; then
    echo "Database is ready."
    break
  fi
  if [ "$i" = "30" ]; then
    echo "Database connection timeout after 30 attempts."
    exit 1
  fi
  echo "Attempt $i: waiting for database..."
  sleep 2
done

echo "Pushing database schema..."
npx drizzle-kit push
echo "Schema pushed."

echo "Starting application..."
exec node dist/index.cjs

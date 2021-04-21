#!/bin/bash

# This script prepares the database and runs Rails server

# Exit immediately if a command exits with a non-zero status.
set -e

# Check environment variables
/bin/bash ./check-env.sh

# Remove a potentially pre-existing server.pid for Rails.
rm -f $APP_ROOT/tmp/pids/server.pid

# Wait until the database is ready
until bundle exec rake db:version; do
  >&2 echo "Database is unavailable - sleeping"
  sleep 1
done

# Create database, load schema, run migrations and seed data in an idempotent way.
echo "Preparing database..."
db_version=$(bundle exec rake db:version)
if [ "$db_version" = "Current version: 0" ]; then
  bundle exec rake db:create
  bundle exec rake db:schema:load
  bundle exec rake db:migrate
  bundle exec rake db:seed
else
  bundle exec rake db:migrate
fi
echo "Database prepared."

# Launch web server
echo "Environment is: $ENVIRONMENT"
export RAILS_ENV="$ENVIRONMENT"
export NODE_ENV="$ENVIRONMENT"
if [ "$ENVIRONMENT" = "development" ]; then
  foreman start -p 3000
else
  rails assets:precompile
  rails server -e production
fi
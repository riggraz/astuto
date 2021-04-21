#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# List of environment variables that must be present
env_vars=(
	"ENVIRONMENT" \
	"POSTGRES_USER" \
	"POSTGRES_PASSWORD" \
	"EMAIL_CONFIRMATION" \
	"APP_NAME" \
	"SHOW_LOGO" \
	"POSTS_PER_PAGE" \
)

# Check each one
n_of_errors=0
for each in "${env_vars[@]}"; do
	if ! [[ -v $each ]]; then
		echo "Environment variable "$each" is not set."
		n_of_errors=$((n_of_errors+1))
	fi
done

if [ $n_of_errors -gt 0 ]; then
	echo "You need to set ${n_of_errors} environment variables."
	echo "You can do so either in docker-compose.yml or in a .env file."
	echo "Check out: https://github.com/riggraz/astuto/wiki/Required-environment-variables"
	exit 2
fi
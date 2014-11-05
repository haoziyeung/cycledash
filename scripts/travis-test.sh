#!/bin/bash
# Run both the Python & JS tests.
set -o errexit

. ./ENV.sh
nosetests __tests__/python

npm test
./scripts/travis-coverage.sh

#!/bin/bash
# Run the Python tests
set -o errexit

DB=cycledash-test

# --if-exists means to not report an error if the DB doesn't exist.
dropdb --if-exists $DB
createdb $DB
python scripts/init_db.py force

nosetests tests/python

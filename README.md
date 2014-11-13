[![Build Status](https://travis-ci.org/hammerlab/cycledash.svg?branch=master)](https://travis-ci.org/hammerlab/cycledash) [![Coverage Status](https://img.shields.io/coveralls/hammerlab/cycledash/master.svg)](https://coveralls.io/r/hammerlab/cycledash?branch=master)


## CycleDash

CycleDash tracks variant caller runs and facilitates analyses on them. It
provides a RESTful(ish) interface and faciliates the analysis of VCFs.

### About

For now, see `/` in the running webapp.

### Setting up CycleDash

```bash
virtualenv venv                    # Initialize a new virtual environment.
source venv/bin/activate           # Activate your virtual environment.
pip install -r requirements.txt    # Install requirements into virtualenv.
make initenv                       # Initialize environment file.
$EDITOR ENV.sh                     # Fill in values.
./initialize_database.sh           # Create database tables
```

For hammerlab folks, you'll want to set `WEBHDFS_URL` to
`http://demeter.hpc.mssm.edu:14000`.

### Start CycleDash

To start the application server:

```bash
gulp prod
./run.sh
```

Start a worker to process the queue:

```
./worker.sh Bob # Or whatever you want to name your worker.
                # Say, RosieTheRiveter.
```

You can start more workers with `./worker.sh <name>` etc. *with a different
name*.

### Development


#### JavaScript

You can make working with Javascript very easy with the following:

```
npm install             # Installs all packages in package.json.
npm install gulp -g     # Make sure you have gulp installed.
gulp                    # Compile the JS and start the automatic compiler
                        # and live-reloader.
```

To regenerate the `bundled.js` file without using the live reloader, run:

```
gulp build
```

This will also minify the JS and not create a source map.

To update BioDalliance, run:

```
npm install
gulp dalliance
```

#### Python

If `USE_RELOADER` is True in your ENV.sh, then you'll get automatic
code-reloading with the Flask server (and JS/CSS via Gulp).

To test the workers locally, you'll need to install and run rabbitmq during
development. For example, on Mac OS X, you can do this via:

```bash
brew install rabbitmq
/usr/local/opt/rabbitmq/sbin/rabbitmq-server
```

### Config

(Edit ENV.sh file, generated by `make initenv`).

Environment variables which must be exported--edit them in the ENV.sh file make
made for you.

```
export PORT=5000
export DATABASE_URL='sqlite:///test.db'
export CELERY_BACKEND='db+sqlite:///celery.db'
export CELERY_BROKER='amqp://localhost'
export WEBHDFS_USER=username
export WEBHDFS_URL=http://example.com:5000
export TYPEKIT_URL="yourtypekitURLwithfontsincluded"
```

### API Usage

The primary endpoint for posting data to from an external source is `/runs`.

Additional information can be found on `/`, on the running webserver.

JSON should be posted to this URL with following fields:

**Required**<br />
`vcfPath` -- The path on HDFS where the VCF can be found. This should be immutable, as CycleDash expects to be able to find the VCF here at any time.<br />
`variantCallerName` -- The name of the variant caller which produced this VCF. This should remain constrant between VCFs with the same caller in order to compare runs to one another.<br />

**Optional, highly recommended if truth VCF exists**<br />
`truthVcfPath` -- The path on HDFS for the truth (or "reference") VCF. This should be immutable.<br />

**Optional**<br />
`dataset` -- The name of the dataset on which the caller was run (e.g. Dream Chromosome 20).<br />
`tumorPath` -- The path on HDFS of the tumor BAM on which the caller was run.<br />
`normalPath` -- The path on HDFS of the normalBAM on which the caller was run.<br />
`params` -- Params that the caller was run with, or other notes relevant to the run.<br />


### Testing

CycleDash uses [nosetests](https://nose.readthedocs.org/en/latest/) for Python tests, and [Mocha](http://mochajs.org/) for JavaScript testing.

To run tests:

```
nosetests __tests__/python   # Run Python tests
npm test   # Run JS tests
```

CycleDash uses dpxdt for perceptual diff testing. To update the reference screenshots:

```
dpxdt update __tests__/pdifftests
```

To determine whether there are any pixels that have changed before/after, and to
generate a perceptual diff that will make it clear where the changes are, use
the following command:

*Note*: you will need to have imagemagick installed for the following command to
succeed.

```
dpxdt test __tests__/pdifftests
```

Running `git status` after this should indicate whether the screenshots have changed.

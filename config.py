import os



SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', '')
PORT = os.environ.get('PORT', 5000)
DEBUG = os.environ.get('DEBUG', True) # TODO(ihodes): unsafe, but this doesn't
                                      # matter here.


del os
import mock
import nose
import json

from cycledash import app, db
from common.helpers import tables

from test_projects_api import create_project_with_name


def create_bam_with_name(project_id, name, uri='hdfs://testbam.bam'):
    with tables(db.engine, 'bams') as (con, bams):
        res = bams.insert(
            {'name': name,
             'project_id': project_id,
             'uri': uri}).returning(*bams.c).execute()
        return dict(res.fetchone())


class TestBamsAPI(object):
    PROJECT_NAME = 'TEST PROJECT BAM'
    BAM_NAME = 'something bam name'
    PATH = 'hdfs://somebam.bam'

    def setUp(self):
        self.app = app.test_client()
        self.project = create_project_with_name(self.PROJECT_NAME)

    def tearDown(self):
        with tables(db.engine, 'projects', 'bams') as (con, projects, bams):
            bams.delete(bams.c.name == self.BAM_NAME).execute()
            projects.delete(projects.c.name == self.PROJECT_NAME).execute()

    @mock.patch('workers.indexer.index.delay', lambda *args, **kwargs: True)
    def test_create_bam(self):
        NOTES = 'random notes'
        TISSUES = 'left ovary etc'
        r = self.app.post('/api/bams',
                          data=json.dumps({'name': self.BAM_NAME,
                                           'notes': NOTES,
                                           'tissues': TISSUES,
                                           'uri': self.PATH,
                                           'projectId': self.project['id']}))
        assert r.status_code == 201
        assert isinstance(json.loads(r.data)['id'], int)
        assert json.loads(r.data)['projectId'] == self.project['id']
        assert json.loads(r.data)['name'] == self.BAM_NAME
        assert json.loads(r.data)['tissues'] == TISSUES
        assert json.loads(r.data)['notes'] == NOTES
        assert json.loads(r.data)['uri'] == self.PATH

    @mock.patch('workers.indexer.index.delay', lambda *args, **kwargs: True)
    def test_create_bam_with_project_name(self):
        r = self.app.post('/api/bams',
                          data=json.dumps({'name': self.BAM_NAME,
                                           'uri': self.PATH,
                                           'projectName': self.project['name']}))
        assert r.status_code == 201
        assert isinstance(json.loads(r.data)['id'], int)
        assert json.loads(r.data)['projectId'] == self.project['id']
        assert json.loads(r.data)['name'] == self.BAM_NAME
        assert json.loads(r.data)['uri'] == self.PATH

    def test_create_bam_without_project(self):
        r = self.app.post('/api/bams',
                          data=json.dumps({'name': self.BAM_NAME,
                                           'uri': self.PATH}))
        assert r.status_code == 409
        assert 'is required' in json.loads(r.data)['errors'][0]
        assert 'Validation error' in json.loads(r.data)['message']

    def test_create_bam_with_nonexistent_project(self):
        r = self.app.post('/api/bams',
                          data=json.dumps({'name': self.BAM_NAME,
                                           'uri': self.PATH,
                                           'projectId': 1000000000}))
        assert r.status_code == 404
        assert 'not found' in json.loads(r.data)['message']

    def test_get_bam(self):
        bam = create_bam_with_name(self.project['id'], self.BAM_NAME)

        r = self.app.get('/api/bams/{}'.format(bam['id']))
        assert r.status_code == 200
        assert json.loads(r.data)['id'] == bam['id']
        assert json.loads(r.data)['name'] == bam['name']


    def test_get_bams(self):
        bam = create_bam_with_name(self.project['id'], self.BAM_NAME)
        r = self.app.get('/api/bams')
        bams = json.loads(r.data)['bams']
        assert r.status_code == 200
        assert isinstance(bams, list)
        assert bams[0]['name'] == bam['name']


    def test_update_bam(self):
        bam = create_bam_with_name(self.project['id'], self.BAM_NAME)

        NEW_NOTES = 'these are new BAM notes'
        r = self.app.put('/api/bams/{}'.format(bam['id']),
                         data=json.dumps({'notes': NEW_NOTES}))
        assert r.status_code == 200
        assert json.loads(r.data)['id'] == bam['id']
        assert json.loads(r.data)['name'] == bam['name']
        assert json.loads(r.data)['notes'] == NEW_NOTES


    def test_delete_bam(self):
        bam = create_bam_with_name(self.project['id'], self.BAM_NAME)
        r = self.app.delete('/api/bams/{}'.format(bam['id']))
        assert r.status_code == 200
        assert json.loads(r.data)['id'] == bam['id']
        assert json.loads(r.data)['name'] == bam['name']
        r = self.app.get('/api/bams/{}'.format(bam['id']))
        assert r.status_code == 404

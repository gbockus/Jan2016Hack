'use strict';

var app = require('../..');
import request from 'supertest';

var newProcess;

describe('Process API:', function() {

  describe('GET /api/Porcesses', function() {
    var Processs;

    beforeEach(function(done) {
      request(app)
        .get('/api/Porcesses')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Processs = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      Processs.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/Porcesses', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/Porcesses')
        .send({
          name: 'New Process',
          info: 'This is the brand new Process!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newProcess = res.body;
          done();
        });
    });

    it('should respond with the newly created Process', function() {
      newProcess.name.should.equal('New Process');
      newProcess.info.should.equal('This is the brand new Process!!!');
    });

  });

  describe('GET /api/Porcesses/:id', function() {
    var Process;

    beforeEach(function(done) {
      request(app)
        .get('/api/Porcesses/' + newProcess._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Process = res.body;
          done();
        });
    });

    afterEach(function() {
      Process = {};
    });

    it('should respond with the requested Process', function() {
      Process.name.should.equal('New Process');
      Process.info.should.equal('This is the brand new Process!!!');
    });

  });

  describe('PUT /api/Porcesses/:id', function() {
    var updatedProcess;

    beforeEach(function(done) {
      request(app)
        .put('/api/Porcesses/' + newProcess._id)
        .send({
          name: 'Updated Process',
          info: 'This is the updated Process!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedProcess = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedProcess = {};
    });

    it('should respond with the updated Process', function() {
      updatedProcess.name.should.equal('Updated Process');
      updatedProcess.info.should.equal('This is the updated Process!!!');
    });

  });

  describe('DELETE /api/Porcesses/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/Porcesses/' + newProcess._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when Process does not exist', function(done) {
      request(app)
        .delete('/api/Porcesses/' + newProcess._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});

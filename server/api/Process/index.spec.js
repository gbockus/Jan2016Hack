'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var ProcessCtrlStub = {
  index: 'ProcessCtrl.index',
  show: 'ProcessCtrl.show',
  create: 'ProcessCtrl.create',
  update: 'ProcessCtrl.update',
  destroy: 'ProcessCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var ProcessIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './Process.controller': ProcessCtrlStub
});

describe('Process API Router:', function() {

  it('should return an express router instance', function() {
    ProcessIndex.should.equal(routerStub);
  });

  describe('GET /api/Porcesses', function() {

    it('should route to Process.controller.index', function() {
      routerStub.get
        .withArgs('/', 'ProcessCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/Porcesses/:id', function() {

    it('should route to Process.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'ProcessCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/Porcesses', function() {

    it('should route to Process.controller.create', function() {
      routerStub.post
        .withArgs('/', 'ProcessCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/Porcesses/:id', function() {

    it('should route to Process.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'ProcessCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/Porcesses/:id', function() {

    it('should route to Process.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'ProcessCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/Porcesses/:id', function() {

    it('should route to Process.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'ProcessCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});

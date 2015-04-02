'use strict';

var chai = require('chai');
var should = chai.should();

var Group = require('../../lib/spec/group');

describe('Group', function() {

  var groupMock;
  beforeEach(function() {
    groupMock = new Group({
      name: 'Stuff',
      description: 'things'
    });
  });

  it('instantiates from constructor', function() {
    should.exist(groupMock);
  });

  it('instantiates from create', function() {
    var group = Group.create();
    should.exist(group)
  });

  it('instantiates from create with opts', function() {
    var group = Group.create({});
    should.exist(group)
  });

  it('has public set to false if no value is provided', function () {
    groupMock.public.should.equal(false);
  });

  it('has public set to true if value "yes" is provided', function () {
    var group = Group.create({ public: 'yes' });
    group.public.should.equal(true);
  });

});

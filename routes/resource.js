var User = require('../models/user')
  , Blog = require('../models/blog');

exports.create = function(mongoose) {
  var mongo = mongoose;
  return function(req, res, next) {
    var mongoModel = mongo.model(req.params.resource);
    if(!mongoModel) {
      next();
      return;
    }
    mongoModel.create(req.body, function (err, obj) {
      if (err) {
        console.log(err);
        res.send(500, err);
      }
      else {
        res.send(200, obj);
      }
    });
  };
}

/*
 * GET resource listing.
 */
exports.list = function(mongoose) {
  var mongo = mongoose;
  return function(req, res, next) {
    var mongoModel = null; 
    try {
      mongoModel = mongo.model(req.params.resource);
    } catch(err) {
      console.log(err);
    } 
    if(!mongoModel) {
      next();
      return;
    } 
    var options = {};
    if(req.query.skip) {
      options.skip = req.query.skip;
    }
    if(req.query.limit) {
      options.limit = req.query.limit;
    }
    mongoModel.find(null, null, options, function (err, objs) {
      if (err) {
        console.log(err);
        res.send(500, err);
      } else {
        res.send(200, objs);
      }
    });
  }; 
}

exports.findById = function(mongoose) {
  var mongo = mongoose;
  return function(req, res, next) {
    var mongoModel = mongo.model(req.params.resource);
    if(!mongoModel) {
      next();
      return;
    }
    var id = req.params.id;
    mongoModel.findById(id, function (err, obj) {
      if (err) {
        console.log(err);
        res.send(404, err);
      }
      else {
        res.send(200, obj);
      }
    });
  };
}

exports.deleteById = function(mongoose) {
  var mongo = mongoose;
  return function(req, res, next) {
    var mongoModel = mongo.model(req.params.resource);
    if(!mongoModel) {
      next();
      return;
    }
    var id = req.params.id;
    mongoModel.findByIdAndRemove(id, function (err, obj) {
      if (err) {
        console.log(err);
        res.send(404, err);
      }
      else {
        res.send(200, obj);
      }
    });
  };
}

exports.updateById = function(mongoose) {
  var mongo = mongoose;
  return function(req, res, next) {
    var mongoModel = mongo.model(req.params.resource);
    if(!mongoModel) {
      next();
      return;
    }
    var id = req.params.id;
    mongoModel.findByIdAndUpdate(id, req.body, function (err, obj) {
      if (err) {
        console.log(err);
        res.send(404, err);
      }
      else {
        res.send(200, obj);
      }
    });
  };
}

/**
 * Expose the CRUD operations as REST APIs
 */
exports.setup = function(app, mongoose) {
  // Create a new entity
  app.post('/rest/:resource', exports.create(mongoose));

  // List the entities
  app.get('/rest/:resource', exports.list(mongoose));

  // Find the entity by id
  app.get('/rest/:resource/:id', exports.findById(mongoose));

  // Update the entity by id
  app.put('/rest/:resource/:id', exports.updateById(mongoose));

  // Delete the entity by id
  app.delete('/rest/:resource/:id', exports.deleteById(mongoose));
}

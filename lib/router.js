Router.route('/', {name: 'top'});
Router.route('/companySignup', {name: 'companySignup'});
Router.route('/jobSignup');
Router.route('/jobListing');
Router.route('/login');
Router.route('/chat/:_id', {
  name: 'chat',
  data: function() {
    var match = Matches.findOne(this.params._id);
    if (Meteor.user().profile.type === 'company') {
      return Meteor.users.findOne(match.jobSeeker);
    } else {
      return Meteor.users.findOne(match.company);
    }
  }
});

Router.route('/preview', function() {
  if (Meteor.user().profile.type === 'company') {
    this.render('previewCompany');
  } else {
    this.render('previewCandidate');
  }
});

Router.route('/edit', function() {
  if (Meteor.user().profile.type === 'company') {
    this.render('editCompany');
  } else {
    this.render('editCandidate');
  }
});


// Jobs
Router.route('/jobs/interested', function() {
  this.render('jobs', {
    data: {
      jobs: _.filter(Meteor.users.find({'profile.type': 'company'}).fetch(), function(user){
        return _.contains(user['profile'].interested, Meteor.userId());
      })
    }
  });
});
Router.route('/jobs/yes', function() {
  this.render('jobs', {
    data: {
      jobs: _.filter(Meteor.users.find({'profile.type': 'company'}).fetch(), function(user){
        return _.contains(Meteor.user()['profile'].interested, user._id);
      })
    }
  });
});
Router.route('/jobs', function() {
  this.render('jobs', {
    data: { jobs: Meteor.users.find({'profile.type': 'company'}) }
  });
});
Router.route('/job/:_id', {
  name: 'job',
  data: function() {
    return Meteor.users.findOne(this.params._id);
  }
});

// Candidates
Router.route('/candidates/interested', function() {
  this.render('candidates', {
    data: {
      candidates: _.filter(Meteor.users.find({'profile.type': 'jobSeeker'}).fetch(), function(user){
        return _.contains(user['profile'].interested, Meteor.userId());
      })
    }
  });
});
Router.route('/candidates/yes', function() {
  this.render('candidates', {
    data: {
      candidates: _.filter(Meteor.users.find({'profile.type': 'jobSeeker'}).fetch(), function(user){
        return _.contains(Meteor.user()['profile'].interested, user._id);
      })
    }
  });
});
Router.route('/candidates', function() {
  this.render('candidates', {
    data: { candidates: Meteor.users.find({'profile.type': 'jobSeeker'}) }
  });
});
Router.route('/candidate/:_id', {
  name: 'candidate',
  data: function() {
    return Meteor.users.findOne(this.params._id);
  }
});


Router.configure({
  loadingTemplate: 'loading',
  // waitOn: function() { return Meteor.subscribe('posts'); }
});


var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      Router.go('login');
    }
  } else {
    this.next();
  }
}

Router.onBeforeAction(requireLogin, {only: ['jobs', 'job', 'chat', 'candidates', 'candidate',
  'previewCompany', 'previewCandidate', 'editCompany', 'editCandidate']});




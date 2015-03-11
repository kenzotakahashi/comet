Meteor.subscribe("userData");
Meteor.subscribe("matches");
Meteor.subscribe("chat");

Template.login.events({
  'submit form': function(e, template){
    e.preventDefault();
    var user = {
      email: $(e.target).find('[name=email]').val(),
      password: $(e.target).find('[name=password]').val()
    };
    Meteor.loginWithPassword(user.email, user.password, function(error){
      if (error){
        console.log(error.reason);
      } else {
        if (Meteor.user().profile.type === 'company') {
          Router.go('/candidates');
        } else {
          Router.go('/jobs');
        }
      }
    });
  },
});


Template.jobSignup.events({
  'submit form': function(e, template) {
    e.preventDefault();
    var user = {
      name: $(e.target).find('[name=name]').val(),
      email: $(e.target).find('[name=email]').val(),
      password: $(e.target).find('[name=password]').val()
    };

    Accounts.createUser({
      email: user.email,
      password: user.password,
      profile: {
        name: user.name,
        type: 'jobSeeker',
        location: '',
        summary: '',
        interested: [],
        match: [],
      }
    });

    Router.go('jobs');
  }
});

Template.companySignup.events({
  'submit form': function(e, template) {
    e.preventDefault();
    var user = {
      name: $(e.target).find('[name=name]').val(),
      company: $(e.target).find('[name=company]').val(),
      email: $(e.target).find('[name=email]').val(),
      password: $(e.target).find('[name=password]').val()
    };

    Accounts.createUser({
      email: user.email,
      password: user.password,
      profile: {
        name: user.name,
        company: user.company,
        type: 'company',
        location: '',
        summary: '',
        interested: [],
        match: [],
      }
    });

    Router.go('jobListing');
  }
});


Template.jobListing.events({
  'submit form': function(e, template) {
    e.preventDefault();
    profile = {
      'profile.position': $(e.target).find('[name=position]').val(),
      'profile.location': $(e.target).find('[name=location]').val(),
      'profile.skillset': $(e.target).find('[name=skillset]').val().split(","),
      'profile.description': $(e.target).find('[name=description]').val(),
      'profile.url': $(e.target).find('[name=url]').val(),
    };
    Meteor.call('edit', profile, function(error, result) {
      if (error)
        return throwError(error.reason);
      Router.go('candidates');
    });
  }
});



Template.chat.helpers({
  'messages': function(){
    return Chat.find({match: this.matchId});
  },
  'senderName': function(sender){
    return Meteor.users.findOne(sender).profile.name;
  },
  'myLine': function(sender){
    return !! (sender === Meteor.userId());
  },
  'matches': function(){
    if (Meteor.user().profile.type === 'company') {
      return Matches.find({'company': Meteor.userId()});
    } else {
      return Matches.find({'jobSeeker': Meteor.userId()});
    }
  },
  'getUser': function(){
    // 'this' is a match object
    if (Meteor.user().profile.type === 'company') {
      return Meteor.users.findOne(this.jobSeeker).profile.name;
    } else {
      return Meteor.users.findOne(this.company).profile.company;
    }
  }
});

Template.chat.events({
  'click .send, submit form': function(e, template){
    e.preventDefault();

    var $body = $('#message');
    var message = {
      match: this.matchId,
      line: $body.val()
    };

    Meteor.call('sendMessage', message, function(error, result){
      if (error) {
        return throwError(error.reason);
      } else {
        $body.val('');
      }
    });
  }
});

Template.job.events({
  'click .interested': function(e, template) {
    Meteor.call('interested', template.data._id, function(error, result) {
      if (error)
        return throwError(error.reason);
      console.log('success');
    });
  }
});

Template.candidate.events({
  'click .interested': function(e, template) {
    Meteor.call('interested', template.data._id, function(error, result) {
      if (error)
        return throwError(error.reason);
      console.log('success');
    });
  }
});

Template.editCompany.events({
  'submit form': function(e, template) {
    e.preventDefault();
    var profile = {
      'profile.name': $(e.target).find('[name=name]').val(),
      'profile.company': $(e.target).find('[name=company]').val(),
      'profile.position': $(e.target).find('[name=position]').val(),
      'profile.location': $(e.target).find('[name=location]').val(),
      'profile.skillset': $(e.target).find('[name=skillset]').val().split(","),
      'profile.description': $(e.target).find('[name=description]').val(),
    };
    Meteor.call('edit', profile, function(error, result) {
      if (error)
        return throwError(error.reason);
      Router.go('/preview');
    });
  }
});

Template.editCandidate.events({
  'submit form': function(e, template) {
    e.preventDefault();
    var profile = {
      'profile.name': $(e.target).find('[name=name]').val(),
      'profile.location': $(e.target).find('[name=location]').val(),
      'profile.summary': $(e.target).find('[name=summary]').val(),
    };
    Meteor.call('edit', profile, function(error, result) {
      if (error)
        return throwError(error.reason);
      Router.go('/preview');
    });
  }
});


Template.nav.helpers({
  'name': function() {
    return Meteor.user().profile.name;
  }
});


Template.nav.events({
  'click #logout': function(e, template) {
    e.preventDefault();
    Meteor.logout();
    Router.go('/');
  },
  'click .matches': function(e, template) {
    //Todo. Handle no matches
    e.preventDefault();
    console.log(Meteor.user().profile.match[0]);
    Router.go('/chat/' + Meteor.user().profile.match[0]);
  }
});

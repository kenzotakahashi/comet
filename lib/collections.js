// Investors = new Mongo.Collection('investors');
Matches = new Mongo.Collection('matches');
Chat = new Mongo.Collection('chat');

Matches.allow({
  insert: function(userId, doc) {
    return !! userId;
  }
});

Chat.allow({
  insert: function(userId, doc){
    return !! userId;
  }
});

// TODO: input validation (see creating posts in discover meteor)
Meteor.methods({
  edit: function(profile){
      Meteor.users.update({_id: this.userId}, {$set: profile});
  },
  interested: function(userId){
    Meteor.users.update( { _id: this.userId }, { $push: { 'profile.interested': userId }} );
    if (_.contains(Meteor.users.findOne(userId).profile.interested, this.userId)){
      console.log('matched!');
      if (Meteor.user().profile.type === 'company'){
        var company = this.userId;
        var jobSeeker = userId;
      } else {
        var company = userId;
        var jobSeeker = this.userId;
      }
      var matchId = Matches.insert({
        company: company,
        jobSeeker: jobSeeker
      });
      Meteor.users.update({_id: this.userId}, {$push: {'profile.match': matchId}});
      Meteor.users.update({_id: userId},      {$push: {'profile.match': matchId}});
    }
  },
  sendMessage: function(message){
    Chat.insert({
      match: message.match,
      sender: this.userId,
      line: message.line,
      createdAt: new Date(),
    });
  },
});

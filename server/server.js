// Meteor.publish("matches", function(type){
//   if (type === 'company') {
//     return Matches.find({company: this.userId});    
//   } else {
//     return Matches.find({jobSeeker: this.userId});
//   }
// });

Meteor.publish("matches", function(){
  return Matches.find();
});

Meteor.publish("chat", function(){
  return Chat.find();
});

Meteor.publish("userData", function (){
  if (this.userId) {
    return Meteor.users.find();
  } else {
    this.ready();
  }
});


// Accounts.onCreateUser(function(options, user) {
//   // We still want the default hook's 'profile' behavior.
//   if (options.profile)
//     profile = {
//       type: null,
//       location: '',
//       description: '',
//       meet: [],
//       pass: [],
//       match: [],
//     }
//
//   return user;
// });
//


Meteor.startup(function () {
  if (Meteor.users.find().count() === 0){
    for (var i = 0; i < 10; i++){
      Accounts.createUser({
        email: 'company' + i + '@gmail.com',
        password: 'pass' + i,
        profile: {
          type: 'company',
          name: 'CEO ' + i,
          company: 'company ' + i,
          location: 'San Francisco',
          url: 'http://dropbox.com',
          position: 'Full Stack Developer',
          skillset: 'Meteor,Javascipt,CSS,HTML',
          description: 'Dropbox is a free service that lets you bring your photos, docs, and videos anywhere and share them easily. Dropbox was founded in 2007 by Drew Houston and Arash Ferdowsi, two MIT students tired of emailing files to themselves to work from more than one computer.',
          logo: '',
          interested: [],
          match: []
        }
      });
    }

    for (var i = 0; i < 10; i++){
      Accounts.createUser({
        email: 'candidate' + i + '@gmail.com',
        password: 'pass' + i,
        profile: {
          type: 'jobSeeker',
          name: 'candidate ' + i,
          location: 'San Francisco',
          summary: "I'm an Internet guy who believes in the triumph of humanity with a little help from technology. My current job is CEO of Jelly",
          interested: [],
          match: []
        }
      });
    }
  }
});

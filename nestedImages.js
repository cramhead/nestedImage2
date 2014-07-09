FS.debug = true;

if (Meteor.isClient) {

  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
  });

  Template.fileUpload.events({
    'click input': function() {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });

  Template.fileUpload.events({
    'change .fileUploader': function(event, template) {
      FS.Utility.eachFile(event, function(file) {
        var uId = Meteor.userId();
        if (uId) {
          var fileObj = Images.insert(file);
          console.log("fileObj is: " + EJSON.stringify(fileObj));
          var cloney = fileObj.clone(); //EJSON.clone(fileObj);

          Meteor.users.update({
            _id: uId
          }, {
            $set: {
              'profile.profileImage': cloney
            }
          }, function(err, result) {
            if (err) {
              console.log("Error updating user. " + err.detail);
            } else {
              console.log('set profileImage');
            }
          });

        }
      });
    }
  });

  Template.fileDisplay.rendered = function() {

    Meteor.subscribe("images");
  };

  Template.profileDisplay.rendered = function() {
    Meteor.subscribe("users");
  };
  Template.profileDisplay.helpers({
    users: function() {
      return Meteor.users.find();
    }
  });
  Template.fileDisplay.helpers({

    images: function() {
      return Images.find();
    }

  });
}

if (Meteor.isServer) {
  Meteor.startup(function() {
    Accounts.onCreateUser(function(options, user) {
      user.profile = options.profile ? options.profile : {};
      user.profile.profileImage = {};
      return user;
    });
  });

  Meteor.publish("users", function() {
    return Meteor.users.find();
  });

  Meteor.publish('images', function() {
    return Images.find();
  })

}

Meteor.users.allow({
  insert: function(userId, doc) {
    return true;
  },
  update: function(userId, doc, fields, modifier) {
    return true;
  },
  remove: function(userId, doc) {
    return true;
  }
});
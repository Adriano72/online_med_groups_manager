T9n = (require 'meteor-accounts-t9n').T9n
{Template} = require 'meteor/templating'
T9n.setTracker require 'meteor/tracker'
T9n.map 'en', require 'meteor-accounts-t9n/build/en'
T9n.map 'es', require 'meteor-accounts-t9n/build/es'
T9n.setTracker require 'meteor/tracker'
T9n.setLanguage("es")
Template.registerHelper 't9n', (x, params) -> T9n.get(x, true, params.hash)

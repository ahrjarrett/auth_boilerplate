const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
})

// on save hook, encrypt password
userSchema.pre('save', function(next) {

  /* this gives us access to the user model;
   * user is an instance of the user model */
  const user = this

  bcrypt.genSalt(10, function(err, salt) {
    if(err) return next(err)

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if(err) return next(err)

      user.password = hash
      next()
    })
  })
})

userSchema.methods.comparePassword = function(candidatePw, cb) {
  bcrypt.compare(candidatePw, this.password, function(err, isMatch) {
    if(err) return cb(err)

    cb(null, isMatch)
  })
}

const ModelClass = mongoose.model('user', userSchema)

module.exports = ModelClass


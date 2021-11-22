function MissingQueryError(message) {
    Error.call(this, message)
    this.message = message || ''
    this.name = "MissingQueryError"
}
MissingQueryError.prototype = Object.create(Error.prototype)
MissingQueryError.prototype.constructor = MissingQueryError

exports.MissingQueryError = MissingQueryError
this.__proto__.MissingQueryError = MissingQueryError
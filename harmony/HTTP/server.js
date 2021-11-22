'use strict'
include('./exceptions.js')
include('openHarmony.js')

function HTTPDaemon(parent) {
  QTcpServer.call(this, parent)

  this.start = function (port) {
    this.listen(QHostAddress.Any, port)
  }

  this.disabled = false

  this.pause = function () {
    this.disabled = true
  }

  this.resume = function () {
    this.disabled = false
  }

  this.routes = {}

  this.add_route = function (route, methods, afunction) {
    this.routes[route] = { methods: methods, function: afunction }
  }

  this.readClient = function () {
    if (this.disabled) {
      return
    }

    if (this.socket.canReadLine()) {
      status_line = this.socket.readLine().split(32)
      request = {
        method: status_line[0].toString(),
        url: new QUrl(status_line[1].toString()),
        protocol: status_line[2].toString()
      }

      if (this.routes.hasOwnProperty(request.url.path())) {
        if (
          this.routes[request.url.path()]['methods'].indexOf(request.method) >=
          0
        ) {
          try {
            result = this.routes[request.url.path()]['function'](
              request.method,
              request.url
            )
            this.socket.write(new QByteArray('HTTP/1.1 200 Ok\r\n'))
          } catch (e) {
            result = { detail: e.name + ' : ' + e.message }
            if (e instanceof MissingQueryError) {
              this.socket.write(new QByteArray('HTTP/1.1 400 Bad Request\r\n'))
            } else {
              this.socket.write(
                new QByteArray('HTTP/1.1 500 Internal Server Error\r\n')
              )
            }
          }
          this.socket.write(
            new QByteArray(
              'Content-Type: application/json; charset="utf-8"\r\n'
            )
          )
          this.socket.write(new QByteArray('\r\n'))
          this.socket.write(new QByteArray(JSON.stringify(result)))
        } else {
          this.socket.write(new QByteArray('HTTP/1.1 501 Not Implemented\r\n'))
          this.socket.write(
            new QByteArray('Content-Type: text/html; charset="utf-8"\r\n')
          )
          this.socket.write(new QByteArray('\r\n'))
          this.socket.write(new QByteArray('<h1>Not Implemented</h1>\n'))
        }
      } else {
        this.socket.write(new QByteArray('HTTP/1.1 404 Not Found\r\n'))
        this.socket.write(
          new QByteArray('Content-Type: text/html; charset="utf-8"\r\n')
        )
        this.socket.write(new QByteArray('\r\n'))
        this.socket.write(new QByteArray('<h1>Not Found</h1>\n'))
      }

      this.socket.close()
      if (this.socket.state() == QAbstractSocket.UnconnectedState) {
        //delete this.socket
      }
    }
  }

  this.discardClient = function () {
    //this.socket.deleteLater()
  }

  this.incomingConnection = function (socket) {
    if (this.disabled) {
      return
    }

    this.socket = new QTcpSocket(this) // TODO: WARNING : this is not safe for managing multiple connections
    this.socket.readyRead.connect(this, 'readClient')
    this.socket.disconnected.connect(this, 'discardClient')
    this.socket.setSocketDescriptor(socket)
  }
}
HTTPDaemon.prototype = Object.create(QTcpServer.prototype)
HTTPDaemon.prototype.constructor = HTTPDaemon

exports.HTTPDaemon = HTTPDaemon
this.__proto__.HTTPDaemon = HTTPDaemon

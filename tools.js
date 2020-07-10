const ping = require('ping')

async function pingHost(host, opt={}){
  try {
    let res = ''
    opt ? res = await ping.promise.probe(host, opt)
        : res = await ping.promise.probe(host)
    return res
  }
  catch (error) {
    console.error(error)
    return error
  }
}

module.exports = {
  pingHost
}

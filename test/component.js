'use strict'

const test = require('ava')
const xmpp = require('../packages/component')
const debug = require('../packages/debug')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

test.cb('component', t => {
  t.plan(8)

  const entity = new xmpp.Component()
  debug(entity)

  entity.on('connect', () => {
    t.pass()
  })

  entity.on('open', el => {
    t.true(el instanceof xmpp.xml.Element)
  })

  entity.handle('authenticate', auth => {
    t.is(typeof auth, 'function')
    return auth('foobar').then(() => t.pass())
  })

  entity.on('online', jid => {
    t.true(jid instanceof xmpp.jid.JID)
    t.is(jid.toString(), 'node-xmpp.localhost')
  })

  entity.start({uri: 'xmpp://localhost:5347', domain: 'node-xmpp.localhost'})
    .then(jid => {
      t.true(jid instanceof xmpp.jid.JID)
      t.is(jid.toString(), 'node-xmpp.localhost')
      entity.stop().then(() => t.end())
    })
})

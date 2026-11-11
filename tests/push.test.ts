import test from 'node:test'
import assert from 'node:assert/strict'
import {validSubscription,pushReady} from '../server/push.ts'
test('push rejects arbitrary server URLs and malformed subscriptions',()=>{for(const endpoint of ['http://127.0.0.1/','https://localhost/','https://fcm.googleapis.com.evil.test/x','https://web.push.apple.com:8000/x'])assert.equal(validSubscription({endpoint,keys:{p256dh:'x',auth:'y'}}),false);assert.equal(validSubscription({endpoint:'https://fcm.googleapis.com/fcm/send/test',keys:{p256dh:'x',auth:'y'}}),true)})
test('push stays disabled without infrastructure configuration',()=>{if(!process.env.REDIS_REST_URL)assert.equal(pushReady(),false)})

import 'dotenv/config'
import Fastify from 'fastify'
import { Worker, isMainThread } from 'worker_threads'

const { ADDRESS = 'localhost', PORT = '3000' } = process.env

const fastify = Fastify({
  logger: true
})

function throwHarpoon (request, reply) {
  const url = request.query.url

  if (!url) {
    return reply.code(400).send('Missing test URL')
  }

  if (isMainThread) {
    const workerData = { url, bindAddress: ADDRESS }

    const addFromBody = key => {
      if (request.body?.[key]) {
        workerData[key] = request.body[key]
      }
    }

    ;['audits', 'chromeArgs', 'logLevel'].forEach(addFromBody)

    const worker = new Worker('./lib/worker.js', { workerData })

    worker.on('message', result => {
      reply.send(result)
    })

    worker.on('error', error => {
      fastify.log.error(error)
      reply
        .status(500)
        .send({ error: 'An error occurred', message: error.message })
    })
  }
}

fastify.get('/throw', throwHarpoon)

fastify.post('/throw', throwHarpoon)

fastify.listen({ host: ADDRESS, port: parseInt(PORT, 10) }, (err, address) => {
  if (err) {
    fastify.log.error(err)
    throw err
  }
  fastify.log.info(`Server is listening on ${address}`)
})

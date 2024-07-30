import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';

 declare module 'fastify' {
  interface FastifyInstance {
    authenticate: any; // You can be more specific with the type if needed
  }
} 

const jwtVerifyPlugin = fp(async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
  if (!fastify.hasDecorator('authenticate')) {
    fastify.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
        try {
        await request.jwtVerify();
        } catch (err) {
        reply.send(err);
        }
    });
  }
});

export default jwtVerifyPlugin;
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export default async function authRoutes(fastify: FastifyInstance) {
  // Define your routes here

  fastify.get('/health', async (request: FastifyRequest, reply: FastifyReply) => {
    return { status: 'ok', time: new Date().toISOString() };
  });

  fastify.get('/another-route', async (request: FastifyRequest, reply: FastifyReply) => {
    return { message: 'This is another route' };
  });
}
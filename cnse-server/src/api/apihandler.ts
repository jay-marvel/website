import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export default async function apiRoutes(fastify: FastifyInstance) {
  // Define your routes here

  fastify.get('/projects', async (request: FastifyRequest, reply: FastifyReply) => {
    return { status: 'ok', msg:"This is a placeholder for future project list",
      time: new Date().toISOString() };
  });

  fastify.get('/another-route', async (request: FastifyRequest, reply: FastifyReply) => {
    return { message: 'This is another route' };
  });
}
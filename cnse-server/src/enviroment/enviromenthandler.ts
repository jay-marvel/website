import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { enviroment } from '../db';
import { ObjectId, MongoError } from "mongodb";

export default async function environmentRoutes(fastify: FastifyInstance) {
  // Define your routes here

  fastify.post<
    {Body: enviroment}
  >('/create', async (request, reply) => {
    const collection = fastify.mongo.db?.collection<enviroment>('enviroments');
    if (!collection) {
      return reply.status(500).send({ message: 'Collection not found' });
    } else {
      await collection.createIndex({ name: 1 }, { unique: true });
    }

    const env = request.body;

    const environment: enviroment = {
      name: env.name,
      keywords: env.keywords,
      description: env.description,
      contributors: env.contributors,
      exploit_directions: env.exploit_directions,
      install_instructions: env.install_instructions,
      submission_date: new Date(),
      link: env.link,
    };

    try {
      const result = await collection.insertOne(environment);
      reply.status(200).send({ message: 'Environment created successfully', id: result.insertedId });
    } catch (err) {
      if (err instanceof MongoError) {
        if (err.code === 11000) {
          reply.status(400).send({ message: 'Environment name already exists' });
        } else {
          fastify.log.error(err);
          reply.status(500).send({ message: 'Internal Server Error', details: err.message });
        }
      } else {
        fastify.log.error('An unexpected error occurred', err);
        reply.status(500).send({ message: 'Internal Server Error' });
      }
    }
  });
}

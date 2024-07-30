import {fastify, FastifyRequest, FastifyReply} from 'fastify'  
import { ObjectId } from 'mongodb';

import fastifyMongodb from '@fastify/mongodb'
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt'
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import jwtVerifyPlugin from './authplugin';

import authRoutes from './auth/authhandler'
import apiRoutes from './api/apihandler'
import accountRoutes from './account/accounthandler'
import enviromentRoutes from './enviroment/enviromenthandler';

 const server = fastify({
	logger: {
		level: 'debug'
	}
}) 

// Load environment variables from .env file
dotenv.config();
//const server = fastify() 

//TODO: deal with this later
let defaultMongoURL = 'mongodb://localhost:27017/cnse-portal'

// Register CORS plugin
server.register(cors, {
	origin: '*', // Allow all origins
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
	allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  });
server.register(fastifyMongodb, {
	forceClose: true,
	url: process.env.MONGO_URL || defaultMongoURL
})

// Register the fastify-jwt plugin
server.register(fastifyJwt, {
	secret: process.env.JWT_SECRET || uuidv4(), // Use environment variable
	sign: {
	  expiresIn: '1h', // JWT expiration time
	},
});




server.register(jwtVerifyPlugin);


server.register(authRoutes, { prefix: '/auth' });
server.register(apiRoutes, { prefix: '/api' });
server.register(accountRoutes, { prefix: '/account' });
server.register(enviromentRoutes, { prefix: '/enviroment' });
// Declare a route  
server.get('/', function (request, reply) {  
	reply.send({ hello: 'world' })  
})  
  
server.get('/items', async (request, reply) => {
	const collection = server.mongo.db?.collection('books');
	if (!collection) {
	  return reply.status(500).send({ message: 'Collection not found' });
	}
  
	try {
	  const items = await collection.find().toArray();
	  reply.send(items);
	} catch (err) {
	  server.log.error(err);
	  reply.status(500).send({ message: 'Internal Server Error' });
	}
});
server.get('/enviro', async (request, reply) => {
	const collection = server.mongo.db?.collection('enviroments');
	if (!collection) {
	  return reply.status(500).send({ message: 'Collection not found' });
	}
	try {
	  const items = await collection.find().toArray();
	  reply.send(items);
	} catch (err) {
	  server.log.error(err);
	  reply.status(500).send({ message: 'Internal Server Error' });
	}
});
interface ItemParams {
	id: string;
  }
server.get('/items/:id', async (request: FastifyRequest<{ Params: ItemParams }>, reply: FastifyReply) => {
	const collection = server.mongo.db?.collection('books');
	if (!collection) {
	  return reply.status(500).send({ message: 'Collection not found' });
	}
  
	const { id } = request.params;
  
	try {
	  const item = await collection.findOne({ _id: new ObjectId(id) });
	  if (!item) {
		return reply.status(404).send({ message: 'Item not found' });
	  }
	  reply.send(item);
	} catch (err) {
	  server.log.error(err);
	  reply.status(500).send({ message: 'Internal Server Error' });
	}
  });
  
  server.get('/enviro/:id', async (request: FastifyRequest<{ Params: ItemParams }>, reply: FastifyReply) => {
	const collection = server.mongo.db?.collection('enviroments');
	if (!collection) {
	  return reply.status(500).send({ message: 'Collection not found' });
	}
  
	const { id } = request.params;
  
	try {
	  const item = await collection.findOne({ _id: new ObjectId(id) });
	  if (!item) {
		return reply.status(404).send({ message: 'Item not found' });
	  }
	  reply.send(item);
	} catch (err) {
	  server.log.error(err);
	  reply.status(500).send({ message: 'Internal Server Error' });
	}
  });
// Run the server!  
server.listen({ port: 3000 }, function (err, address) {  
	if (err) {  
		server.log.error(err)  
		process.exit(1)  
	}
	
	console.log(`Server is now listening on ${address}`)  
})
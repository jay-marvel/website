import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { User, LookupUserByEmail } from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ObjectId, MongoError } from "mongodb";

const SALT_ROUNDS = process.env.SALT_ROUNDS || 10;

export default async function accountRoutes(fastify: FastifyInstance) {
  // Define your routes here

  fastify.post<
    {Body: User}
  >('/create', async (request , reply) => {
    //const { collection } = fastify.mongo.db!;
    const collection = fastify.mongo.db?.collection<User>('users');
  if (!collection) {
    return reply.status(500).send({ message: 'Collection not found' });
  } else {
    await collection.createIndex({ email: 1 }, { unique: true });
  }
    //const { username, email, password } = request.body;
    const u = request.body;

    //TODO:  Add a stronger password validation method, length, special
    //characters, etc.  For now just checking that a value is provided
    if (!u.password){
      reply.status(400).send({ message: 'Password cannot be empty' });
    }
    
    const passwordHash = await bcrypt.hash(u.password??'', SALT_ROUNDS);
    const user: User = {
      email : u.email,
      password:passwordHash,
      firstName: u.firstName,
      lastName: u.lastName,
      institution: u.institution,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try{
      const result = await collection.insertOne(user);
      
      //reply.status(200).send({ message: 'User created ok' });

      //sends token when finished
      const token = fastify.jwt.sign({ 
        userId: result.insertedId,
        userEmail: user.email 
      }, { expiresIn: '1h' });

      reply.status(200).send({ message: 'User created successfully', token });
     
    } catch (err) {
      if (err instanceof(MongoError)){
        if (err.code === 11000){
          reply.status(400).send({ message: 'Email already exists' });
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

  fastify.post<{ Body: { email: string, password: string } }>('/login', async (request, reply) => {
    const { email, password } = request.body;

    if (!fastify.mongo.db){
      return reply.status(401).send({ message: 'No connection to database' });
    }

    const result = await LookupUserByEmail(fastify.mongo.db, email)
  
    if (result.error){
      return reply.status(404).send({Message: result.error})
    }

    if (!result.user){
      return reply.status(500).send({Message: 'User object invalid'})
    }

    const user = result.user

    // Compare the provided password with the hashed password
    const isValidPassword = await bcrypt.compare(password, user.password??'');
    if (!isValidPassword) {
      return reply.status(401).send({ message: 'Invalid email or password' });
    }
  
      // Generate a JWT token
      const token = fastify.jwt.sign({ 
        userId: result.user._id,
        userEmail: result.user.email 
      }, { expiresIn: '1h' });
  
      // Send the token as a response
      reply.send({ token });
  });


  fastify.get('/profile',  {
    onRequest: [fastify.authenticate]
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    let user = request.user as any
    let email = user.userEmail

    if (!fastify.mongo.db){
      return reply.status(401).send({ message: 'No connection to database' });
    }
    
    const result = await LookupUserByEmail(fastify.mongo.db, email)
  
    //sanitize these fields
    delete result.user?._id;
    delete result.user?.password;
    delete result.user?.createdAt;
    delete result.user?.updatedAt;

    return { status: result, time: new Date().toISOString() };
  });

  fastify.get('/auth-status',  {
    onRequest: [fastify.authenticate]
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    //if we make it here, we are authorized

    return { status: 'OK', jwtToken: 'valid', time: new Date().toISOString() };
  });

  fastify.get('/health',async (request: FastifyRequest, reply: FastifyReply) => {
    return { message: 'This is a future healthcheck' };
  });
}




// fastify.post<{ Body: { email: string, password: string } }>('/loginold', async (request, reply) => {
  //   const { email, password } = request.body;
  
  //   // Access the collection
  //   const collection = fastify.mongo.db?.collection<User>('users');
  //   if (!collection) {
  //     return reply.status(500).send({ message: 'Collection not found' });
  //   }
  
  //   try {
  //     // Find the user by email
  //     const user = await collection.findOne({ email });
  //     if (!user) {
  //       return reply.status(401).send({ message: 'Invalid email or password' });
  //     }
  
      
  //     // Compare the provided password with the hashed password
  //     const isValidPassword = await bcrypt.compare(password, user.password??'');
  //     if (!isValidPassword) {
  //       return reply.status(401).send({ message: 'Invalid email or password' });
  //     }
  
  //     // Generate a JWT token
  //     const payload = {
  //       userId : user._id,
  //       userEmail : user.email
  //     };
  //     fastify.log.debug(payload);


  //     const token = fastify.jwt.sign(payload, { expiresIn: '1h' });
  
  //     // Send the token as a response
  //     reply.send({ token });
  //   } catch (err) {
  //     // Handle unexpected errors
  //     if (err instanceof Error) {
  //       fastify.log.error(err);
  //       reply.status(500).send({ message: 'Internal Server Error', details: err.message });
  //     } else {
  //       fastify.log.error('An unexpected error occurred', err);
  //       reply.status(500).send({ message: 'Internal Server Error' });
  //     }
  //   }
  // });
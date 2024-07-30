// types.ts
import { ObjectId } from "@fastify/mongodb";
import { Db } from "mongodb";
import { createDeflate } from "zlib";

export interface User {
  _id?: ObjectId;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  institution: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface enviroment {
  _id?: ObjectId;
  name: string;
  keywords?: Array<string>;
  contributors: string;
  description: string;
  link: string;
  exploit_directions: string;
  install_instructions: string
  submission_date?: Date;
  
}

export interface UserLookupResult {
  success: boolean;
  code: number,
  user?: User;
  error?: string;
}

// Function to look up a user by email
export async function LookupUserByEmail(db: Db, email: string): Promise<UserLookupResult> {
  const collection = db.collection<User>('users');
  if (!collection) {
    return { success: false, code: 401, error: 'Collection not found' };
  }

  try {
    const user = await collection.findOne({ email });
    if (!user) {
      return { success: false, code: 11000, error: 'User not found' };
    }
    return { success: true, code:200, user };
  } catch (err) {
    console.error(err);
    return { success: false, code: 500, error: 'Internal Server Error' };
  }
}

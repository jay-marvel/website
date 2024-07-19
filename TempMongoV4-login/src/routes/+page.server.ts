import { tutorials } from "$db/tutorial";
import type { PageServerLoad } from './$types';


import type {Actions,RequestEvent,ActionFailure,Redirect} from '@sveltejs/kit';
import {fail,redirect} from '@sveltejs/kit';
import type { registerFormData } from '../types/form';
import {registerUser,registerFormToUserWithoutId,returnEmailsList } from '../backendUtils';
import {checkPassword} from '../passwordCheck';
import { dbConn } from '../dbConn';



type Tutorial = {
  _id: string;
  title: string;
  author: string,
  ratings: number,
  genres: []
};
type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  
};
export const load: PageServerLoad = async function(): Promise<{ tutorials: Tutorial[] }> {
  const data = await tutorials.find({}, { limit: 50, projection: { title: 1, author: 1, ratings: 1,  pages: 1, genres: 1, reviews: 1 } }).toArray();

  // Convert ObjectId to string
  const serializedData = data.map(item => ({
    ...item,
    _id: item._id.toString()
  }));
  const collection = await dbConn();
  const usersData = await collection.find({}, { projection: { firstName: 1, lastName: 1, email: 1, url: 1 } }).toArray();
  const serializedUsers = usersData.map(item => ({
    ...item,
    _id: item._id.toString()
  }));
  return {
    tutorials: serializedData,
    users: serializedUsers
  };
};



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


//edit this later
export const actions: Actions = {
  
  signup: async ({ request }: RequestEvent): Promise<registerFormData | ActionFailure<registerFormData> | Redirect> => {
    
    const signupFormData = await request.formData();
    const firstName = signupFormData.get('firstName') ?? '';
    const lastName = signupFormData.get('lastName') ?? '';
    const email = signupFormData.get('email') ?? '';
    const password = signupFormData.get('password') ?? '';

    let SignUpResponse: registerFormData = {
      emailUsed: false,
      weakPassword: false,
      error: false,
      success: false,
      message: '',
      firstName,
      lastName,
      email,
      password: ''
    };

    const isPassStrong = checkPassword(password.toString());

    if (!isPassStrong) {
      SignUpResponse.weakPassword = true;
      SignUpResponse.error = true;
      SignUpResponse.message = "Password does not meet requirements!";
      return fail(400, SignUpResponse);
    }

    const collection = await dbConn();

    let emailList = [];

    try {
      emailList = await returnEmailsList(collection);
      if (emailList.includes(email.toString())) {
        SignUpResponse.error = true;
        SignUpResponse.emailUsed = true;
        SignUpResponse.message = "This email address has already been used!";
        return fail(400, SignUpResponse);
      }
    } catch (error: any) {
      SignUpResponse.error = true;
      SignUpResponse.message = "Error confirming email is available! Try again shortly!";
      return fail(500, SignUpResponse);
    }

    SignUpResponse.password = password;
    const userToInsert = await registerFormToUserWithoutId(SignUpResponse);
    const resultOfInsert = await registerUser(collection, userToInsert);
    if (resultOfInsert.acknowledged && resultOfInsert.insertedId){
      //this works, sends user back to home page
      
      throw redirect(303, `/`);
      //add custon event handling here so that it sends something to make the modal disappear
      
    } 

    SignUpResponse.password = '';
    SignUpResponse.error = true;
    SignUpResponse.message = "Error registering User!";
    return fail(503, SignUpResponse);
  }
};

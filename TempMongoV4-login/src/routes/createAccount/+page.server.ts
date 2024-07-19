import type {Actions,RequestEvent,ActionFailure,Redirect} from '@sveltejs/kit';
import {fail,redirect} from '@sveltejs/kit';
import type { registerFormData } from '../../types/form';
import {registerUser,registerFormToUserWithoutId,returnEmailsList } from '../../backendUtils';
import {checkPassword} from '../../passwordCheck';
import { dbConn } from '../../dbConn';


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
        
        
        throw redirect(303, `/`);
        
        
      } 
  
      SignUpResponse.password = '';
      SignUpResponse.error = true;
      SignUpResponse.message = "Error registering User!";
      return fail(503, SignUpResponse);
    }
  };
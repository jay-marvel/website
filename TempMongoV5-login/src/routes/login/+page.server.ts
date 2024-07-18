import type {Actions,RequestEvent,ActionFailure,Redirect} from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import type { loginFormResponse } from '../../types/form';
import { findUserByEmailWithPassword } from '../../backendUtils';
import { dbConn } from '../../dbConn';
import { SECRET_INGREDIENT } from '$env/static/private';

import brcyptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';


export async function load({cookies}){
    const authToken = cookies.get('authToken');
    if(!authToken){
        console.log("No token found")
        return {clearUser: true}
    }
    console.log("token found")
    return{clearUser:false}
}

export const actions:Actions = {
    
    login: async ({cookies,request}:RequestEvent): Promise<loginFormResponse | ActionFailure<loginFormResponse> | Redirect> =>{
        const loginFormData = await request.formData();
        const email = loginFormData.get('email')?.toString()?? '';
        const password = loginFormData.get('password')?.toString()?? '';

        let loginResponse = {
            email,
            error: false,
            message: ''
        }
        console.log("Login attempt with email:", email)
        try{
            console.log('Attempting to connect to database');
            const collection = await dbConn();
            console.log("connected")
            const userAttemptingLogin = await findUserByEmailWithPassword(collection,email);
            if (!userAttemptingLogin) {
                console.log("User not found with email:", email);
                loginResponse.error = true;
                loginResponse.message = "Invalid username or password!";
                return loginResponse;
            }
            const authAttempt = await brcyptjs.compare(password,userAttemptingLogin.password);
            if(!authAttempt){
                console.log('password comparison failed')
                loginResponse.error = true,
                loginResponse.message = "Invalid username or password!"
                return loginResponse
            }

            console.log(`User retrieved from DB: ${JSON.stringify(userAttemptingLogin)}`);
            if(authAttempt){
                const {password,...userAttempingLoginMinusPassword} = userAttemptingLogin;
                const authToken = jwt.sign({authedUser:userAttempingLoginMinusPassword },SECRET_INGREDIENT,{expiresIn:'24h'});
                cookies.set('authToken',authToken,{httpOnly: true,maxAge: 60 * 60 * 24,sameSite: 'strict', path:"/"})
                throw redirect(302,'/');
            }
        } catch (error) {
            console.error("Error during login process:", error);
            loginResponse.error = true;
            loginResponse.message = "An error occurred during login.";
            return loginResponse;
        }
        finally{
            return loginResponse
        }




    }
}
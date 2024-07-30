import { token, clearToken, getToken } from '$stores/auth'; // Your token store
import api from '$lib/axios';
import  { AxiosError } from 'axios';

export async function ValidateLogin(): Promise<boolean>{
    const tok = getToken();

    //See if no token is available
    if (!tok) return false;

    //Now lets validate that the token is OK
    try{
        const response = await api.get('/account/auth-status');
        return true;
    }catch (err){
        return false;
    }
}

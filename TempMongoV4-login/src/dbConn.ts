import {  Collection, MongoClient } from "mongodb";
import {MONGO_URL} from '$env/static/private';


export const dbConn = async ():Promise<Collection>=>{
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    const dbName = 'AllUsers';
    const db = client.db(dbName);
    const collection = db.collection('users');
    return collection
}
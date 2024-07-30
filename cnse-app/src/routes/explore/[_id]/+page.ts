type documents = {
    _id: number;
    name: string;
    keywords: Array<string>;
    submission_date: string;
    contributors: string;
    description: string;
    exploit_directions: string;
    install_instructions: string;
    link: string;
}

export const load = async ({ fetch, params }) => {
    const {_id} = params;
    const response = await fetch(`http://127.0.0.1:3000/enviro/${_id}`) // will need to edit this in future to reflect actuall API
    const enviroment: documents = await response.json();
    return {
        enviroment
    }
}
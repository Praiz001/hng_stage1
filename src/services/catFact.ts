import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const TIMEOUT = process.env.API_TIMEOUT || 5000;
const url = process.env.CAT_FACT_API_URL || 'https://catfact.ninja/fact';
const getCatFact = async () => {

    try {
        const response = await axios.get(url, { timeout: Number(TIMEOUT) });
        return response.data.fact;

    } catch (error) {
        console.error('Error getting cat fact:', error);
        return 'Unable to fetch cat fact at this time'; //fallback
    }
}

export { getCatFact };
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const TIMEOUT = process.env.TIMEOUT || 5000;
const url = process.env.CAT_FACT_API_URL;
const getCatFact = async () => {

    try {
  
        if (url) {
            const response = await axios.get(url, { timeout: Number(TIMEOUT) });
            return response.data.fact;
        } else {
            throw new Error('CAT_FACT_URL is not set');
        }

    } catch (error) {
        console.error('Error getting cat fact:', error);
        return 'Unable to fetch cat fact at this time'; //fallback
    }
}

export { getCatFact };
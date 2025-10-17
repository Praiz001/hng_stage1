import { getCatFact } from "./catFact";


const getProfile = async () => {

    try {
        const catFact: string = await getCatFact();

        const profileData = {
            email: 'oshilimpraisek@gmail.com',
            name: 'Praise Oshilim',
            stack: "Node.js/Express",
            timestamp: new Date().toISOString(),
            fact: catFact,
        }

        return profileData;
    } catch (error) {
        console.error('Error getting profile:', error);
        throw new Error('Failed to get profile');
    }
};

export { getProfile };
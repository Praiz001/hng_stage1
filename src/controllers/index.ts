import { Request, Response } from "express";
import { getProfile } from "../services";
import { errorResponse, successResponse } from "../helpers/responseHandler";

const getMyProfile = async (req: Request, res: Response) => {

    try {
        const profile = await getProfile();

        const response = successResponse({
            user: {
                email: profile.email,
                name: profile.name,
                stack: profile.stack,
            },
            timestamp: profile.timestamp,
            fact: profile.fact,
        });

        res.status(200).json(response);

    } catch (error) {
        console.error('Error getting user profile:', error);
        const response = errorResponse("Error getting user profile", error);
        res.status(500).json(response);
    }
};

export { getMyProfile };
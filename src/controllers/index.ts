import { Request, Response } from "express";
import { checkStringExists, deleteString, getAllStrings, getString, saveString } from "../services";
import { errorResponse, successResponse } from "../helpers/responseHandler";
import { HttpStatusCode } from "axios";
import { checkForConflict, naturalLanguageQueryParser } from "../utils/stringAnalyzer";
import Joi from "joi";
import { validateSchema } from "../helpers/validation";
import { AnalyzedStringsFilter } from "../models/stringAnalyzer";

const analyzeString = async (req: Request, res: Response) => {

    try {
        const { value } = req.body;

        const bodySchema = Joi.object({ //body schema
            value: Joi.string().required()
                .messages({
                    'any.required': 'Invalid request body or missing "value" field',
                    'string.base': 'Invalid data type for "value" (must be string)'
                })
                .trim(),
        });

        const bodyValidationError = await validateSchema(bodySchema, { value }); //validate body

        if (bodyValidationError && bodyValidationError.includes("Invalid data type")) {
            return res
                .status(HttpStatusCode.BadRequest)
                .json(errorResponse("Invalid data type for 'value' (must be string)"));
        } else if (bodyValidationError && bodyValidationError.includes("Invalid request body")) {
            return res
                .status(HttpStatusCode.UnprocessableEntity)
                .json(errorResponse("Invalid request body or missing 'value' field"));
        }

        //check if string already exists
        const stringExists = checkStringExists(value?.toLowerCase());
        if (stringExists) {
            return res.status(HttpStatusCode.Conflict).json(errorResponse("String already exists in the system"));
        }

        //save to memory
        const analyzedString = saveString(value?.toLowerCase());
        if (!analyzedString) {
            return res.status(HttpStatusCode.InternalServerError).json(errorResponse("Error saving string"));
        }

        res.status(HttpStatusCode.Created).json(successResponse(analyzedString));

    } catch (error) {
        console.error('Error analyzing string:', error);
        return res.status(HttpStatusCode.InternalServerError).json(errorResponse("Error analyzing string"));
    }
};

const getAnalyzedString = async (req: Request, res: Response) => {

    try {
        const { string_value } = req.params;

        const paramsSchema = Joi.object({ //body schema
            string_value: Joi.string().required().trim(),
        });

        const paramsValidationError = await validateSchema(paramsSchema, { string_value }); //validate params
        
        if (paramsValidationError) {
            return res
                .status(HttpStatusCode.BadRequest)
                .json(errorResponse("Invalid request params(must be a string)"));
        }

        const analyzedString = getString(string_value); //get analyzed string from memory
        if (!analyzedString) {
            return res
                .status(HttpStatusCode.NotFound)
                .json(errorResponse("String does not exist in the system."));
        }

        return res
            .status(HttpStatusCode.Ok)
            .json(successResponse(analyzedString));

    } catch (error) {
        console.error('Error getting analyzed string:', error);
        return res
            .status(HttpStatusCode.InternalServerError)
            .json(errorResponse("Error getting analyzed string"));
    }
}

const getAllAnalyzedStrings = async (req: Request, res: Response) => {

    try {
        const query = req.query;

        const allowedParams = ['is_palindrome', 'min_length', 'max_length', 'word_count', 'contains_character'];
        const unexpectedParams = Object.keys(query || {}).filter(key => !allowedParams.includes(key));

        if (unexpectedParams.length > 0) {
            return res
                .status(HttpStatusCode.BadRequest)
                .json(errorResponse("Invalid query parameter values or types"));
        }

        const formattedQuery = { //convert query params to valid types
            is_palindrome: query.is_palindrome === 'true' ? true : query.is_palindrome === 'false' ? false : query.is_palindrome,
            min_length: query.min_length ? parseInt(query.min_length as string) : undefined,
            max_length: query.max_length ? parseInt(query.max_length as string) : undefined,
            word_count: query.word_count ? parseInt(query.word_count as string) : undefined,
            contains_character: query.contains_character as string || undefined
        };

        const querySchema = Joi.object({ //query schema
            is_palindrome: Joi.boolean().optional(),
            min_length: Joi.number().optional(),
            max_length: Joi.number().optional(),
            word_count: Joi.number().optional(),
            contains_character: Joi.string().optional(),
        });


        const queryValidationError = await validateSchema(querySchema, formattedQuery);

        if (queryValidationError) {
            return res
                .status(HttpStatusCode.BadRequest)
                .json(errorResponse("Invalid query parameter values or types"));
        }

        //get all analyzed strings from memory
        const analyzedStrings = getAllStrings(formattedQuery as AnalyzedStringsFilter);
        if (analyzedStrings.length === 0) {
            return res.status(HttpStatusCode.NoContent).json(successResponse({ data: [] }));
        }

        return res.status(HttpStatusCode.Ok).json(successResponse({ data: analyzedStrings }));

    } catch (error) {
        console.error('Error getting all analyzed strings:', error);
        return res.status(HttpStatusCode.InternalServerError).json(errorResponse("Error getting all analyzed strings"));
    }
}

const filterByNaturalLanguage = async (req: Request, res: Response) => {

    try {
        const query = req.query;

        const querySchema = Joi.object({ //query schema
            query: Joi.string().required().trim(),
        });

        const queryValidationError = await validateSchema(querySchema, query);

        if (queryValidationError) {
            return res
                .status(HttpStatusCode.BadRequest)
                .json(errorResponse("Invalid query parameter values or types"));
        }

        const extractedQuery = naturalLanguageQueryParser(query.query as string); //parse query param into filter object

        if (!extractedQuery) { //unable to parse query param
            return res.status(HttpStatusCode.BadRequest).json(errorResponse("Unable to parse natural language query"));
        }

        const isConflict = checkForConflict(extractedQuery); //check for conflict in the generated query
        if (isConflict) {
            return res.status(HttpStatusCode.BadRequest).json(errorResponse("Query parsed but resulted in conflicting filters"));
        }

        const filterObject = extractedQuery.reduce((acc, curr) => { //reduce extracted query to a single object
            return { ...acc, ...curr };
        }, {});

        const filteredStrings = getAllStrings(filterObject); //get all matching strings from memory

        if (filteredStrings.length === 0) {
            return res.status(HttpStatusCode.NoContent).json(successResponse({ data: [] }));
        }

        return res.status(HttpStatusCode.Ok).json(successResponse({ data: filteredStrings }));
    }
    catch (error) {
        console.error('Error filtering by natural language:', error);
        return res.status(HttpStatusCode.InternalServerError).json(errorResponse("Error filtering by natural language"));
    }
}

const deleteAnalyzedString = async (req: Request, res: Response) => {
    const { string_value } = req.params;

    try {
        const analyzedStringToDelete = getString(string_value); //get analyzed string from memory
        if (!analyzedStringToDelete) {
            return res.status(HttpStatusCode.NotFound).json(errorResponse("String does not exist in the system."));
        }

        const hasDeleted = deleteString(string_value?.toLowerCase()); //delete analyzed string from memory
        if (!hasDeleted) {
            return res.status(HttpStatusCode.InternalServerError).json(errorResponse("Error deleting string"));
        }

        return res.status(HttpStatusCode.NoContent).json(successResponse({ data: {} }));
    } catch (error) {
        console.error('Error getting analyzed string:', error);
        return res.status(HttpStatusCode.InternalServerError).json(errorResponse("Error getting analyzed string"));
    }
}

export {
    analyzeString, getAnalyzedString,
    getAllAnalyzedStrings, filterByNaturalLanguage,
    deleteAnalyzedString
};
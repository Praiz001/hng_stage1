import { AnalyzedString, AnalyzedStringsFilter } from "../models/stringAnalyzer";
import { generateSha256, getCharFrequencyMap, getUniqueCharCount, 
    getWordCount, isPalindrome 
} from "../utils/stringAnalyzer";


// In-memory storage
let analyzedStrings: AnalyzedString[] = [];

const checkStringExists = (string: string): boolean | null => {
    //check if string already exists in memory
    const analyzedString = analyzedStrings.find(s => s.value?.toLowerCase() === string);
    return analyzedString ? true : null;
};

const saveString = (string: string): AnalyzedString | null => {

    const analyzedString = {
        id: generateSha256(string),
        value: string,
        properties: {
            length: string?.length,
            is_palindrome: isPalindrome(string),
            unique_characters: getUniqueCharCount(string),
            word_count: getWordCount(string),
            sha256_hash: generateSha256(string),
            character_frequency_map: getCharFrequencyMap(string),
        },
        created_at: new Date().toISOString(),
    }
    //save analyzed string to memory
    analyzedStrings.push(analyzedString);

    return analyzedString;
}

const getString = (string: string): AnalyzedString | null => {
    //get string from memory
    const analyzedString = analyzedStrings.find(s => s.value === string?.toLowerCase());
    return analyzedString ? analyzedString : null;
}
const getAllStrings = (filter?: AnalyzedStringsFilter): AnalyzedString[] => {
    const { is_palindrome, min_length, max_length, word_count, contains_character } = filter || {};

    let filteredStrings = analyzedStrings;

    if (is_palindrome || is_palindrome === false) {
        filteredStrings = filteredStrings.filter(fs => fs.properties.is_palindrome === is_palindrome);
    }

    if (min_length) {
        filteredStrings = filteredStrings.filter(fs => fs.properties.length >= min_length);
    }

    if (max_length) {
        filteredStrings = filteredStrings.filter(fs => fs.properties.length <= max_length);
    }

    if (word_count) {
        filteredStrings = filteredStrings.filter(fs => fs.properties.word_count === word_count);
    }

    if (contains_character) {
        filteredStrings = filteredStrings.filter(fs => fs.value.includes(contains_character));
    }


    return filteredStrings;
}


const deleteString = (string: string): boolean => {
    let isDeleted = false;
    //delete string from memory
    const stringToDelete = analyzedStrings.find(s => s.value === string?.toLowerCase());
    if (stringToDelete) {
        analyzedStrings = analyzedStrings.filter(s => s.value !== string?.toLowerCase());
        isDeleted = true;
    }
    return isDeleted;
}



export { checkStringExists, saveString, getString, getAllStrings, deleteString };
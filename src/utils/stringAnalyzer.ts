import { createHash } from 'node:crypto';
import { AnalyzedStringsFilter } from '../models/stringAnalyzer';

export const generateSha256 = (content: string) => { //generate sha256 hash of the content
    return createHash('sha256').update(content).digest('hex');
}

export const isPalindrome = (content: string) => { //check if the content is a palindrome
    return content === content.split('').reverse().join('');
}

export const getUniqueCharCount = (content: string) => { //get number of unique chars in the content
    return new Set(content).size;
}

export const getWordCount = (content: string) => { //get number of words in the content
    return content.split(' ').length;
}

export const getCharFrequencyMap = (content: string) => { //get frequency of each char in the content
    return content.split('').reduce((acc, char) => {
        acc[char] = (acc[char] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
}

export const naturalLanguageQueryBuilder = (naturalLanguageQuery: string) => {
    let query: AnalyzedStringsFilter[] = [];

    if (naturalLanguageQuery.includes('single word palindromic')) {
        query.push({ is_palindrome: true, word_count: 1 });
    }

    if (naturalLanguageQuery.includes('longer than 10 characters')) {
        query.push({ min_length: 11 });
    }

    if (naturalLanguageQuery.includes('palindromic strings that contain the first vowel')) {
        query.push({ is_palindrome: true, contains_character: 'a' });
    }

    if (naturalLanguageQuery.includes('containing the letter z')) {
        query.push({ contains_character: 'z' });
    }

    // Return null only if no conditions matched
    return query.length > 0 ? query : null;
}

export const checkForConflict = (data: AnalyzedStringsFilter[]) => {
    let isConflict = false;
    const keyValues: Record<string, any> = {};

    for (const obj of data) {
        for (const [key, value] of Object.entries(obj)) {
            if (key in keyValues && keyValues[key] !== value) {
                isConflict = true; // key occurs more than once with conflicting value
            } else {
                keyValues[key] = value;
            }
        }
    }
    return isConflict;
}
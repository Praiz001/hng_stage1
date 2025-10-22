export interface AnalyzedString {
    id: string;
    value: string;
    properties: {
        length: number;
        is_palindrome: boolean;
        unique_characters: number;
        word_count: number;
        sha256_hash: string;
        character_frequency_map: Record<string, number>;
    };
    created_at: string;
}

export interface AnalyzedStringsFilter {
    is_palindrome?: boolean;
    min_length?: number;
    max_length?: number;
    word_count?: number;
    contains_character?: string;
}
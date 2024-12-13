// Comprehensive list of profane words and variations
const profanityList = [
    // Common explicit words (mild to severe)
    'fuck', 'shit', 'damn', 'cunt', 'bitch', 'asshole', 'dick', 'cock', 
    'pussy', 'bastard', 'whore', 'slut', 'nigger', 'faggot', 

    // Variations and common misspellings
    'f*ck', 'f**k', 'sh*t', 'c*ck', 'motherf*cker', 'a$$hole', 'bi7ch', 
    'b!tch', 'sl*t', 'p*ssy', 'w*hore', 'sh!t', '5hit', 'sh1t',

    // Partial matches to catch more variations
    'fuc', 'fuk', 'sht', 'nigg', 'fag', 'btch', 'd1ck', 'pus', 'wh0re',

    // Offensive terms and slurs (various categories)
    'retard', 'gay', 'lesbian', 'tranny', 'chink', 'nazi', 'hitler', 
    'kike', 'spic', 'wetback', 'gook', 'cracker', 'sandnigger', 
    'raghead', 'cameljockey', 'jap', 'chink', 'coon', 'darkie', 

    // Sexual references and innuendos
    'dildo', 'buttplug', 'masturbate', 'orgasm', 'anal', 'blowjob', 
    'handjob', 'cum', 'jizz', 'erection', 'horny', 'boner', 'boob', 
    'tits', 'nipples', 'vagina', 'clit', 'penis', 'phallus', 'testicle', 

    // Racial and religious slurs
    'zionist', 'infidel', 'jihadi', 'terrorist', 'holocaust', 'redskin', 
    'savage', 'slave', 'gypsy', 'heeb', 'muzzy', 'pakki', 'towelhead', 

    // Creative spellings and substitutions
    'f@ck', 'fu©k', 'sh!t', '5hit', 'fukc', 'shyt', 'n1gga', 'nibba', 
    'n!gga', 'n1gger', 'd1ck', 'c0ck', 'c*nt', 'b!tch', 'bi7ch', 
    'a55hole', 'azzhole', 'pu55y', 'p0rn', 'pr0n', 

    // Common username tricks
    '4ss', 'h0e', 'w0rds', 'c1t', '5lut', 'wh0r3', 'phaggot', 'phag',

    // Abbreviations and acronyms
    'wtf', 'lmfao', 'stfu', 'gtfo', 'fml', 'omfg', 'lmao', 

    // L33t substitutions and creative encodings
    'f\\/ck', 'c\\/ck', 'sh\\/t', 'd1ck', 'b1tch', 'pu$$y', 'a$$', 
    'f(_)ck', 'sh(_)t', 'n1gg@', '@ss', 'fück', 'cünt', 'sîut', 

    // Unicode variations
    'ＦＵＣＫ', 'ＳＨＩＴ', 'ＢＩＴＣＨ', 'ＡＳＳＨＯＬＥ', 
    'ＣＯＣＫ', 'ＰＵＳＳＹ', 'ＤＡＭＮ', 'ＷＨＯＲＥ', 

    // Spaces and delimiters
    'f u c k', 's h i t', 'c u n t', 'a s s h o l e', 'd i c k', 
    'p u s s y', 'w h o r e', 'n i g g e r', 'f a g g o t',

    // Offensive emojis and symbols
    '🍆', '💦', '🍑', '🤡', '👅', '💋', 

    // Potentially offensive nicknames or references
    'sugarbaby', 'slaughter', 'killer', 'sadist', 'masochist', 
    'pedophile', 'rapist', 'molester', 'necrophile', 

    // Broad offensive language
    'die', 'kill', 'murder', 'suicide', 'hang', 'lynch', 
];


/**
 * Checks if a username contains profanity
 * @param {string} username - The username to check
 * @returns {boolean} - True if profanity is detected, false otherwise
 */
export function containsProfanity(username) {
    // Convert to lowercase for case-insensitive checking
    const lowercaseUsername = username.toLowerCase();

    // Remove common username substitutions and special characters
    const cleanedUsername = lowercaseUsername
        .replace(/[^a-z0-9]/g, '') // Remove special characters
        .replace(/4/g, 'a')    // Replace 4 with a
        .replace(/1/g, 'i')    // Replace 1 with i
        .replace(/0/g, 'o')    // Replace 0 with o
        .replace(/3/g, 'e')    // Replace 3 with e
        .replace(/5/g, 's')    // Replace 5 with s

    // Check for exact or partial matches
    return profanityList.some(word => 
        cleanedUsername.includes(word)
    );
}

/**
 * Advanced profanity filter with more nuanced checking
 * @param {string} username - The username to validate
 * @returns {object} - Validation result with details
 */
export function validateUsername(username) {
    // Basic length check
    if (username.length < 3 || username.length > 20) {
        return {
            isValid: false,
            message: 'Username must be between 3 and 20 characters'
        };
    }

    // Check for profanity
    if (containsProfanity(username)) {
        return {
            isValid: false,
            message: 'Username contains inappropriate language'
        };
    }

    // Additional checks can be added here (e.g., allowed characters)
    const allowedCharacters = /^[a-zA-Z0-9._-]+$/;
    if (!allowedCharacters.test(username)) {
        return {
            isValid: false,
            message: 'Username can only contain letters, numbers, periods, underscores, and hyphens'
        };
    }

    return {
        isValid: true,
        message: 'Username is valid'
    };
}
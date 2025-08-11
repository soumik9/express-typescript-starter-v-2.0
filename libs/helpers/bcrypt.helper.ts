import bcrypt from 'bcrypt';
import { config } from '../../config';

// @helper: compareHash function
export const compareHash = async (comparableString: string, hashValue: string): Promise<boolean> => {
    const isMatched = await bcrypt.compare(comparableString, hashValue);
    return isMatched;
};

// @helper: generateHash function
export const generateHash = async (string: string): Promise<string> => {
    const hashedString = await bcrypt.hashSync(string, Number(config.BCRYPT.SALT_ROUND));
    return hashedString;
};
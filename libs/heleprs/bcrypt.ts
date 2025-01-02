import bcrypt from 'bcrypt';
import { config } from '../../config/server/config';

export const comparePassword = async (comparableString: string, hashValue: string): Promise<boolean> => {
    const isMatched = await bcrypt.compare(comparableString, hashValue);
    return isMatched;
};

export const generateHash = async (string: string): Promise<string> => {
    const hashedString = await bcrypt.hashSync(string, Number(config.BCRYPT.SALT_ROUND));
    return hashedString;
};
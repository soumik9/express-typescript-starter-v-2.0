// services/Hash.service.ts
import bcrypt from 'bcrypt';
import { config } from '../../../config';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken'

interface ITokenPayload {
    email: string;
    _id: string;
    [key: string]: any;
}

export class SecurityService {
    private static instance: SecurityService;

    private constructor() { }

    /** Singleton accessor */
    public static getInstance(): SecurityService {
        if (!SecurityService.instance) {
            SecurityService.instance = new SecurityService();
        }
        return SecurityService.instance;
    }

    // Hashing
    public async generateHash(value: string): Promise<string> {
        return bcrypt.hash(value, Number(config.BCRYPT.SALT_ROUND));
    }

    public async compareHash(value: string, hash: string): Promise<boolean> {
        return bcrypt.compare(value, hash);
    }

    // JWT
    public generateToken(payload: ITokenPayload): string {
        return jwt.sign(payload, config.TOKEN.SECRET as Secret, {
            expiresIn: String(config.TOKEN.EXPIRES_IN),
        });
    }

    public verifyToken(token: string, secret?: Secret): JwtPayload {
        return jwt.verify(token, secret || config.TOKEN.SECRET) as JwtPayload;
    }
}

// Export singleton instance
export const SecurityInstance = SecurityService.getInstance();

import { config } from '../../config';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken'

// @helper: generate token
export const generateToken = (data: any): String => {

    const payload = {
        email: data.email, _id: data._id
    };

    // token generating
    const token = jwt.sign(
        payload, config.TOKEN.SECRET as Secret, { expiresIn: String(config.TOKEN.EXPIRES_IN) }
    );

    return token;
};

// @helper: verify token
export const verifyToken = (token: string, secret: Secret): JwtPayload => {
    return jwt.verify(token, secret) as JwtPayload;
};
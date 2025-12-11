import passport from "passport";
import httpStatus from "http-status";
import { ApiError } from "../../config";
import { PassportKeyEnum } from "../../libs/enum";
import { Request, Response, NextFunction } from "express";

class AuthMiddleware {
    private static instance: AuthMiddleware;

    private constructor() { }

    /** Singleton accessor */
    public static getInstance(): AuthMiddleware {
        if (!AuthMiddleware.instance) {
            AuthMiddleware.instance = new AuthMiddleware();
        }
        return AuthMiddleware.instance;
    }

    private runPassport(req: Request, res: Response, next: NextFunction, cb: Function) {
        passport.authenticate(
            PassportKeyEnum.JwtAuth,
            { session: false },
            (err: any, user: any) => {
                if (err || !user) {
                    return next(new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized access"));
                }
                cb(user);
            }
        )(req, res, next);
    }

    private checkRoles(requiredRoles: string[], user: any, next: NextFunction) {
        if (requiredRoles.length && !requiredRoles.includes(user.role)) {
            return next(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
        }
    }

    /**
     * Main middleware maker
     */
    public verify(...requiredRoles: string[]) {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                this.runPassport(req, res, next, (user: any) => {
                    this.checkRoles(requiredRoles, user, next);

                    // Normalize into req.admin for backward compatibility
                    req.admin = {
                        _id: user._id,
                        email: user.email,
                        role: user.role,
                        name: user.name,
                    };

                    next();
                });
            } catch (error) {
                next(error);
            }
        };
    }
}

// Export singleton instance
export const AuthMiddlewareInstance = AuthMiddleware.getInstance();
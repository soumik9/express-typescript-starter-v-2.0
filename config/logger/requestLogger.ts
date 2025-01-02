import moment from "moment";
import { NextFunction, Request, Response } from "express";
import { getRequestFulllUrl } from "../../libs/heleprs/global";
import { httpLogger } from "./logConfig";

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const { method } = req;
    const startTime = moment();

    res.on('finish', () => {
        const endTime = moment();
        const duration = endTime.diff(startTime);
        const formattedDuration = moment.duration(duration).asMilliseconds();
        const message = `${method} ${getRequestFulllUrl(req)} ${res.statusCode} - ${formattedDuration}ms`;
        httpLogger.http(message);
    });

    next();
};

export default requestLogger;
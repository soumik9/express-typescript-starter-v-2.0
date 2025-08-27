import httpStatus from 'http-status';
import { Application, Request, Response } from 'express';
import { EMAIL_TEMPLATE_ENUM } from '../../../libs/enums';
import { getRequestFulllUrl, getServerHealth, renderTemplate } from '../../../libs/helpers';

// home route
export const handleWelcomeRoute = (req: Request, res: Response) => {
    const htmlContent = renderTemplate(EMAIL_TEMPLATE_ENUM.HOME, {
        title: "Backend",
        explore_url: "https://soumikahammed.com/",
    });

    res
        .setHeader("Content-Type", "text/html; charset=utf-8")
        .status(httpStatus.OK)
        .send(htmlContent);
}

// Health route
export const handleHealthRoute = (app: Application) => {
    return (req: Request, res: Response) => {
        const healthData = getServerHealth(app);

        // Render HTML or JSON
        if (req.query.format === "json") {
            res
                .status(healthData.isReady ? httpStatus.OK : httpStatus.SERVICE_UNAVAILABLE)
                .json(healthData);
        } else {
            const htmlContent = renderTemplate(EMAIL_TEMPLATE_ENUM.HEALTH, healthData);
            res
                .setHeader("Content-Type", "text/html; charset=utf-8")
                .status(healthData.isReady ? httpStatus.OK : httpStatus.SERVICE_UNAVAILABLE)
                .send(htmlContent);
        }
    };
};

// not found
export const handleRouteNotFound = (req: Request, res: Response) => {
    const htmlContent = renderTemplate(EMAIL_TEMPLATE_ENUM.NOT_FOUND, {
        original_url: req.originalUrl,
        full_url: getRequestFulllUrl(req),
    });

    res
        .setHeader("Content-Type", "text/html; charset=utf-8")
        .status(httpStatus.NOT_FOUND)
        .send(htmlContent);
};

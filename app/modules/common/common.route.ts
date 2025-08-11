import fs from 'fs';
import path from 'path';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { getRequestFulllUrl } from '../../../libs/helpers';

export const handleRouteNotFound = (req: Request, res: Response) => {
    const filePath = path.join(process.cwd(), 'public', 'html', 'NotFound.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Error loading page.');
        }

        const updatedHtml = data.replace('${req.originalUrl}', getRequestFulllUrl(req));

        res.status(httpStatus.NOT_FOUND).send(updatedHtml);
    });
};

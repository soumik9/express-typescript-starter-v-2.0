// file-compress.helper.ts
import path from 'path';
import fs from 'fs/promises';
import { randomBytes } from 'crypto';
import { errorLogger } from '../logger';
import { IUploadFile } from '../../app/modules';
import sharp from 'sharp';

type FilesObject = {
    [fieldname: string]: IUploadFile[] | undefined;
};

// config — tweak these
const OUTPUT_DIR = path.join(__dirname, '../../public/files'); // match your project
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1920;

// helpers
const ensureDir = async (dir: string) => {
    await fs.mkdir(dir, { recursive: true });
};

const randomName = (original: string) => {
    const ext = path.extname(original) || '';
    const name = Date.now().toString() + '-' + randomBytes(4).toString('hex');
    return `${name}${ext}`;
};

/**
 * Compress & save a single file buffer
 * returns { filename, filepath }
 */
const compressAndSaveBuffer = async (file: IUploadFile): Promise<{ filename: string; filepath: string }> => {
    if (!file.buffer) throw new Error('No buffer found for file');

    const mimetype = file.mimetype?.toLowerCase() ?? '';
    const originalExt = path.extname(file.originalname).toLowerCase();

    await ensureDir(OUTPUT_DIR);

    const outFilename = randomName(file.originalname);
    const outFilePath = path.join(OUTPUT_DIR, outFilename);

    // SVG: save as-is
    if (mimetype === 'image/svg+xml' || originalExt === '.svg') {
        await fs.writeFile(outFilePath, file.buffer);
        return { filename: outFilename, filepath: outFilePath };
    }

    const baseImage = sharp(file.buffer, { failOnError: false }).rotate();
    const meta = await baseImage.metadata().catch(() => ({} as any));

    if ((meta.width && meta.width > MAX_WIDTH) || (meta.height && meta.height > MAX_HEIGHT)) {
        baseImage.resize({
            width: MAX_WIDTH,
            height: MAX_HEIGHT,
            fit: 'inside',
            withoutEnlargement: true,
        });
    }

    // --- Adaptive compression logic ---
    const TARGET_SIZE = 150 * 1024; // 150 KB
    let quality = 80; // starting quality
    let currentSize = Infinity;
    let format: 'jpeg' | 'webp' | 'png' = 'jpeg';
    let outputBuffer: Buffer = file.buffer; // initialize to avoid TS error

    // Decide format
    if (mimetype === 'image/webp' || originalExt === '.webp') {
        format = 'webp';
    } else if (mimetype === 'image/png' || originalExt === '.png') {
        format = 'png';
    } else {
        format = 'jpeg';
    }

    // Compression loop
    while (quality >= 30) {
        const cloned = baseImage.clone();

        if (format === 'webp') {
            outputBuffer = await cloned.webp({ quality }).toBuffer();
        } else if (format === 'png') {
            // Map quality (100→0, 30→7) for compressionLevel
            const compressionLevel = Math.min(9, Math.max(0, Math.floor((100 - quality) / 10)));
            outputBuffer = await cloned.png({ compressionLevel }).toBuffer();
        } else {
            outputBuffer = await cloned.jpeg({ quality }).toBuffer();
        }

        currentSize = outputBuffer.byteLength;

        // Stop if under target
        if (currentSize <= TARGET_SIZE) break;

        quality -= 10;
    }

    // Write to disk
    await fs.writeFile(outFilePath, outputBuffer);

    return { filename: outFilename, filepath: outFilePath };
};



/**
 * Main exported function — mutate the `files` object in-place:
 * for each multer file it will save compressed file to disk and set file.path & file.filename
 */
export const handleFileCompression = async (files: FilesObject | undefined): Promise<void> => {
    if (!files || Object.keys(files).length === 0) return;

    // Create output dir if doesn't exist
    await ensureDir(OUTPUT_DIR);

    // iterate fields (single, cover_single, multiple, etc.)
    const fieldNames = Object.keys(files);

    // Use Promise.all to run concurrently per field array
    await Promise.all(
        fieldNames.map(async (field) => {
            const arr = files[field];
            if (!arr || !Array.isArray(arr) || arr.length === 0) return;

            await Promise.all(
                arr.map(async (file) => {
                    try {
                        // if multer memoryStorage, file.buffer exists
                        if (file.buffer) {
                            const { filename, filepath } = await compressAndSaveBuffer(file);
                            file.filename = filename;
                            file.path = path.join('public', 'files', filename);
                        } else {
                            // If no buffer (edge case), leave as is or handle separately
                            // you may want to write logic to move disk-stored files
                        }
                    } catch (err) {
                        // Clean up on failure of this file (best-effort)
                        errorLogger.error(`File compression error ${err instanceof Error ? err.message : String(err)}`);
                        throw err;
                    }
                })
            );
        })
    );
};
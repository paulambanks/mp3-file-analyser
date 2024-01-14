import { Router } from 'express';
import { uploadMp3 } from '../controllers/upload-mp3.js';
import multer from 'multer';

// Multer is useful for multiple reasons - allows storage of intermediate files on the disc or in memory...
// Recommendations suggest BusBoy if needing a high-volume or production ready solution

const upload = multer();

const router = Router();

router.post('/file-upload', upload.single('file'), uploadMp3);

export default router;

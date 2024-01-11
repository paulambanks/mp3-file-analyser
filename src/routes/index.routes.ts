import { Router } from 'express';
import UploadController from '../controllers/upload.js';
import multer from 'multer';

// Multer is useful for multiple reasons - allows storage of intermediate files on the disc or in memory...
// Recommendations suggest BusBoy if needing a high-volume or production ready solution

const upload = multer();

const router = Router();

router.post('/file-upload', upload.single('file'), UploadController.processFrameCount);

export default router;

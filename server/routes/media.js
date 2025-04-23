import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { authenticate, authorize } from '../middleware/auth.js';
import { media } from '../data/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept images, PDFs, and documents
  const allowedFileTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|ppt|pptx|txt/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, PDFs, and office documents are allowed.'));
  }
};

// Configure upload
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const router = express.Router();

// Get all media
router.get('/', authenticate, async (req, res) => {
  try {
    // Sort by upload date (newest first)
    const sortedMedia = [...media].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    res.status(200).json(sortedMedia);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload media
router.post('/', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const { originalname, filename, mimetype, size } = req.file;
    const filePath = `/uploads/${filename}`;
    
    // Add media to database
    const newMedia = {
      id: uuidv4(),
      name: originalname,
      filename,
      path: filePath,
      type: mimetype,
      size,
      uploadedBy: req.user.id,
      uploadedAt: new Date().toISOString()
    };
    
    media.push(newMedia);
    
    res.status(201).json(newMedia);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete media
router.delete('/:id', authenticate, authorize(['admin', 'editor']), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find media
    const mediaIndex = media.findIndex(m => m.id === id);
    
    if (mediaIndex === -1) {
      return res.status(404).json({ message: 'Media not found' });
    }
    
    // Check if user is uploader or admin
    if (media[mediaIndex].uploadedBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this media' });
    }
    
    // Delete file from disk
    const filePath = path.join(__dirname, '..', media[mediaIndex].path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Remove media from database
    media.splice(mediaIndex, 1);
    
    res.status(200).json({ message: 'Media deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
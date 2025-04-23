import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticate, authorize } from '../middleware/auth.js';
import { contents, categories } from '../data/index.js';

const router = express.Router();

// Get all contents
router.get('/', async (req, res) => {
  try {
    // Query parameters for filtering
    const { status, categoryId, authorId, search } = req.query;
    
    let filteredContents = [...contents];
    
    // Filter by status
    if (status) {
      filteredContents = filteredContents.filter(content => content.status === status);
    }
    
    // Filter by category
    if (categoryId) {
      filteredContents = filteredContents.filter(content => content.categoryId === categoryId);
    }
    
    // Filter by author
    if (authorId) {
      filteredContents = filteredContents.filter(content => content.authorId === authorId);
    }
    
    // Filter by search term
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredContents = filteredContents.filter(content => 
        content.title.toLowerCase().includes(searchTerm) ||
        content.content.toLowerCase().includes(searchTerm)
      );
    }
    
    // Sort by updated date (newest first)
    filteredContents.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    
    res.status(200).json(filteredContents);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get content by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const content = contents.find(content => content.id === id);
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create content
router.post('/', authenticate, authorize(['admin', 'editor']), async (req, res) => {
  try {
    const { title, content, excerpt, categoryId, tags, featuredImage } = req.body;
    
    // Validate input
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    
    // Validate category if provided
    if (categoryId && !categories.some(cat => cat.id === categoryId)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }
    
    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
    
    // Create new content
    const newContent = {
      id: uuidv4(),
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 160) + '...',
      featuredImage: featuredImage || null,
      status: 'draft',
      categoryId: categoryId || null,
      tags: tags || [],
      authorId: req.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add content to database
    contents.push(newContent);
    
    res.status(201).json(newContent);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update content
router.put('/:id', authenticate, authorize(['admin', 'editor']), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, categoryId, tags, featuredImage, status } = req.body;
    
    // Find content
    const contentIndex = contents.findIndex(content => content.id === id);
    
    if (contentIndex === -1) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    // Check if user is author or admin
    if (contents[contentIndex].authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this content' });
    }
    
    // Validate category if provided
    if (categoryId && !categories.some(cat => cat.id === categoryId)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }
    
    // Generate new slug if title is changed
    let slug = contents[contentIndex].slug;
    if (title && title !== contents[contentIndex].title) {
      slug = title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
    }
    
    // Update content
    const updatedContent = {
      ...contents[contentIndex],
      title: title || contents[contentIndex].title,
      slug,
      content: content || contents[contentIndex].content,
      excerpt: excerpt || (content ? content.substring(0, 160) + '...' : contents[contentIndex].excerpt),
      categoryId: categoryId !== undefined ? categoryId : contents[contentIndex].categoryId,
      tags: tags || contents[contentIndex].tags,
      featuredImage: featuredImage !== undefined ? featuredImage : contents[contentIndex].featuredImage,
      status: status || contents[contentIndex].status,
      updatedAt: new Date().toISOString()
    };
    
    // Save updated content
    contents[contentIndex] = updatedContent;
    
    res.status(200).json(updatedContent);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Publish content
router.put('/:id/publish', authenticate, authorize(['admin', 'editor']), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find content
    const contentIndex = contents.findIndex(content => content.id === id);
    
    if (contentIndex === -1) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    // Check if user is author or admin
    if (contents[contentIndex].authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to publish this content' });
    }
    
    // Update content status
    contents[contentIndex] = {
      ...contents[contentIndex],
      status: 'published',
      updatedAt: new Date().toISOString()
    };
    
    res.status(200).json(contents[contentIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete content
router.delete('/:id', authenticate, authorize(['admin', 'editor']), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find content
    const contentIndex = contents.findIndex(content => content.id === id);
    
    if (contentIndex === -1) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    // Check if user is author or admin
    if (contents[contentIndex].authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this content' });
    }
    
    // Remove content
    contents.splice(contentIndex, 1);
    
    res.status(200).json({ message: 'Content deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
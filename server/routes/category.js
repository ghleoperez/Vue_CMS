import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticate, authorize } from '../middleware/auth.js';
import { categories, contents } from '../data/index.js';

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = categories.find(category => category.id === id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create category
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Validate input
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }
    
    // Check if category with same name exists
    if (categories.some(cat => cat.name.toLowerCase() === name.toLowerCase())) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }
    
    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
    
    // Create new category
    const newCategory = {
      id: uuidv4(),
      name,
      slug,
      description: description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add category to database
    categories.push(newCategory);
    
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update category
router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    // Find category
    const categoryIndex = categories.findIndex(category => category.id === id);
    
    if (categoryIndex === -1) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Validate input
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }
    
    // Check if category with same name exists (except current category)
    if (categories.some(cat => 
      cat.name.toLowerCase() === name.toLowerCase() && cat.id !== id
    )) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }
    
    // Generate new slug if name is changed
    let slug = categories[categoryIndex].slug;
    if (name !== categories[categoryIndex].name) {
      slug = name
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
    }
    
    // Update category
    const updatedCategory = {
      ...categories[categoryIndex],
      name,
      slug,
      description: description !== undefined ? description : categories[categoryIndex].description,
      updatedAt: new Date().toISOString()
    };
    
    // Save updated category
    categories[categoryIndex] = updatedCategory;
    
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete category
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find category
    const categoryIndex = categories.findIndex(category => category.id === id);
    
    if (categoryIndex === -1) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Check if category is being used by content
    const inUse = contents.some(content => content.categoryId === id);
    
    if (inUse) {
      return res.status(400).json({ message: 'Cannot delete category that is used by content' });
    }
    
    // Remove category
    categories.splice(categoryIndex, 1);
    
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
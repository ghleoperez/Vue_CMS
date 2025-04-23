import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

// In-memory data store for demo purposes
// In a real application, this would be replaced with a database

// Sample admin user
const adminId = uuidv4();
const adminPassword = bcrypt.hashSync('admin123', 10);

// Users collection
export const users = [
  {
    id: adminId,
    username: 'admin',
    email: 'admin@example.com',
    password: adminPassword,
    role: 'admin',
    createdAt: new Date().toISOString()
  }
];

// Categories collection
export const categories = [
  {
    id: uuidv4(),
    name: 'News',
    slug: 'news',
    description: 'Latest news and updates',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Tutorials',
    slug: 'tutorials',
    description: 'Step-by-step guides and tutorials',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Content collection
export const contents = [
  {
    id: uuidv4(),
    title: 'Getting Started with Vue CMS',
    slug: 'getting-started-with-vue-cms',
    content: 'Welcome to Vue CMS! This is a powerful content management system built with Vue.js and Express. In this article, we will explore the key features and how to get started.',
    excerpt: 'Learn how to get started with the Vue CMS system.',
    featuredImage: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'published',
    categoryId: categories[0].id,
    tags: ['vue', 'cms', 'guide'],
    authorId: adminId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    title: 'Advanced CMS Features',
    slug: 'advanced-cms-features',
    content: 'Discover the advanced features of Vue CMS including media management, user roles, and custom content types. This tutorial explains it all in detail.',
    excerpt: 'Dive deeper into the advanced features of Vue CMS.',
    featuredImage: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    status: 'published',
    categoryId: categories[1].id,
    tags: ['vue', 'cms', 'advanced'],
    authorId: adminId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Media collection
export const media = [];
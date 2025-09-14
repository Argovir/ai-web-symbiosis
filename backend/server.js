const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// CSP headers
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self' http://localhost:8080 http://localhost:3000 http://localhost:5173; img-src 'self' http://localhost:8080 http://localhost:3000 http://localhost:5173 data: blob:; script-src 'self' http://localhost:8080 http://localhost:3000 http://localhost:5173; style-src 'self' http://localhost:8080 http://localhost:3000 http://localhost:5173 'unsafe-inline'");
  next();
});

// Serve favicon
app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // No content
});

app.use(express.json());

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query('SELECT * FROM profiles WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.user_id, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/update-password', authenticateToken, async (req, res) => {
  try {
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'UPDATE profiles SET password_hash = $1, updated_at = NOW() WHERE user_id = $2',
      [hashedPassword, req.user.id]
    );

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Profiles routes
app.get('/api/profiles', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM profiles WHERE user_id = $1', [req.user.id]);
    res.json({ data: result.rows, error: null });
  } catch (error) {
    console.error('Get profiles error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.patch('/api/profiles/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { email, full_name, role, avatar_url } = req.body;

    const result = await pool.query(
      `UPDATE profiles SET email = $1, full_name = $2, role = $3, avatar_url = $4, updated_at = NOW()
       WHERE user_id = $5 RETURNING *`,
      [email, full_name, role, avatar_url, userId]
    );

    res.json({ data: result.rows[0], error: null });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Site settings routes
app.get('/api/site-settings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM site_settings LIMIT 1');
    res.json({ data: result.rows, error: null });
  } catch (error) {
    console.error('Get site settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.patch('/api/site-settings/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Build dynamic update query
    const fields = Object.keys(updates);
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const values = fields.map(field => updates[field]);

    const result = await pool.query(
      `UPDATE site_settings SET ${setClause}, updated_at = NOW(), updated_by = $${values.length + 1} WHERE id = $${values.length + 2} RETURNING *`,
      [...values, req.user.id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Site settings not found' });
    }

    res.json({ data: result.rows[0], error: null });
  } catch (error) {
    console.error('Update site settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Portfolio projects routes
app.get('/api/portfolio-projects', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM portfolio_projects WHERE is_published = true ORDER BY sort_order ASC'
    );
    res.json({ data: result.rows, error: null });
  } catch (error) {
    console.error('Get portfolio projects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/admin/portfolio-projects', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM portfolio_projects ORDER BY sort_order ASC');
    res.json({ data: result.rows, error: null });
  } catch (error) {
    console.error('Get portfolio projects admin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/admin/portfolio-projects', authenticateToken, async (req, res) => {
  try {
    const { title, description, category, tags, live_url, github_url, featured, is_published, sort_order } = req.body;

    const result = await pool.query(
      `INSERT INTO portfolio_projects (title, description, category, tags, live_url, github_url, featured, is_published, sort_order, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [title, description, category, tags, live_url, github_url, featured, is_published, sort_order, req.user.id]
    );

    res.json({ data: result.rows[0], error: null });
  } catch (error) {
    console.error('Create portfolio project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.patch('/api/admin/portfolio-projects/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Build dynamic update query
    const fields = Object.keys(updates);
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const values = fields.map(field => updates[field]);

    const result = await pool.query(
      `UPDATE portfolio_projects SET ${setClause}, updated_at = NOW() WHERE id = $${values.length + 1} RETURNING *`,
      [...values, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ data: result.rows[0], error: null });
  } catch (error) {
    console.error('Update portfolio project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/admin/portfolio-projects/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM portfolio_projects WHERE id = $1', [id]);
    res.json({ data: null, error: null });
  } catch (error) {
    console.error('Delete portfolio project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Blog posts routes
app.get('/api/blog-posts', async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM blog_posts WHERE status = 'published' ORDER BY created_at DESC"
    );
    res.json({ data: result.rows, error: null });
  } catch (error) {
    console.error('Get blog posts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/admin/blog-posts', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM blog_posts ORDER BY created_at DESC');
    res.json({ data: result.rows, error: null });
  } catch (error) {
    console.error('Get blog posts admin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/admin/blog-posts', authenticateToken, async (req, res) => {
  try {
    const { title, slug, excerpt, content, image_url, status, tags, meta_title, meta_description, published_at } = req.body;

    const result = await pool.query(
      `INSERT INTO blog_posts (title, slug, excerpt, content, image_url, status, tags, meta_title, meta_description, published_at, author_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [title, slug, excerpt, content, image_url, status, tags, meta_title, meta_description, published_at, req.user.id]
    );

    res.json({ data: result.rows[0], error: null });
  } catch (error) {
    console.error('Create blog post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.patch('/api/admin/blog-posts/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Build dynamic update query
    const fields = Object.keys(updates);
    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const values = fields.map(field => updates[field]);

    const result = await pool.query(
      `UPDATE blog_posts SET ${setClause}, updated_at = NOW() WHERE id = $${values.length + 1} RETURNING *`,
      [...values, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json({ data: result.rows[0], error: null });
  } catch (error) {
    console.error('Update blog post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/admin/blog-posts/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM blog_posts WHERE id = $1', [id]);
    res.json({ data: null, error: null });
  } catch (error) {
    console.error('Delete blog post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Handle all other routes (404)
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});

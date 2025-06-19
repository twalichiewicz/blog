const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const matter = require('gray-matter');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"]
    }
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${process.env.BASE_URL}/auth/github/callback`
}, (accessToken, refreshToken, profile, done) => {
  // Only allow authorized user
  if (profile.username === process.env.AUTHORIZED_USER) {
    return done(null, profile);
  }
  return done(null, false, { message: 'Unauthorized user' });
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated() && req.user.username === process.env.AUTHORIZED_USER) {
    return next();
  }
  res.redirect('/login');
};

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const postSlug = req.body.slug || 'temp';
    const uploadPath = path.join(process.env.BLOG_PATH, 'source/_posts', postSlug);
    fs.ensureDirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Keep original filename but ensure it's safe
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, safeName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 10 // Max 10 files per upload
  },
  fileFilter: (req, file, cb) => {
    // Allow images and videos
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|webm|mov/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'));
    }
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/editor');
  } else {
    res.redirect('/login');
  }
});

app.get('/login', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Blog Editor - Login</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 40px; background: #f5f5f5; }
        .container { max-width: 400px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { text-align: center; color: #333; margin-bottom: 30px; }
        .login-btn { display: block; width: 100%; padding: 12px; background: #333; color: white; text-decoration: none; text-align: center; border-radius: 4px; font-size: 16px; }
        .login-btn:hover { background: #555; }
        .description { margin-bottom: 30px; color: #666; line-height: 1.5; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Blog Editor</h1>
        <div class="description">
          Secure access to create and manage blog posts for thomas.design. 
          Login with your authorized GitHub account to continue.
        </div>
        <a href="/auth/github" class="login-btn">Login with GitHub</a>
      </div>
    </body>
    </html>
  `);
});

// GitHub OAuth routes
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/editor');
  }
);

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) console.error(err);
    res.redirect('/login');
  });
});

// Main editor interface
app.get('/editor', requireAuth, (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Blog Editor</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        * { box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .header { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
        .container { max-width: 1200px; margin: 0 auto; }
        .form-container { background: white; padding: 30px; border-radius: 8px; margin-bottom: 20px; }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 5px; font-weight: 500; color: #333; }
        input, textarea, select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; }
        textarea { min-height: 200px; font-family: 'Monaco', 'Menlo', monospace; }
        button { background: #007AFF; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-size: 16px; }
        button:hover { background: #005BBB; }
        .secondary-btn { background: #666; }
        .secondary-btn:hover { background: #444; }
        .file-upload { border: 2px dashed #ddd; padding: 30px; text-align: center; border-radius: 4px; margin-top: 10px; }
        .file-upload.dragover { border-color: #007AFF; background: #f0f8ff; }
        .preview { margin-top: 10px; display: flex; flex-wrap: wrap; gap: 10px; }
        .preview-item { position: relative; border: 1px solid #ddd; border-radius: 4px; overflow: hidden; width: 100px; height: 100px; }
        .preview-item img, .preview-item video { width: 100%; height: 100%; object-fit: cover; }
        .remove-file { position: absolute; top: 5px; right: 5px; background: rgba(255,0,0,0.8); color: white; border: none; width: 20px; height: 20px; border-radius: 50%; cursor: pointer; }
        .tabs { display: flex; gap: 10px; margin-bottom: 20px; }
        .tab { padding: 10px 20px; background: #e0e0e0; border: none; border-radius: 4px; cursor: pointer; }
        .tab.active { background: #007AFF; color: white; }
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media (max-width: 768px) { .grid { grid-template-columns: 1fr; } .header { flex-direction: column; gap: 10px; } }
        .status { padding: 10px; margin: 10px 0; border-radius: 4px; }
        .status.success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .status.error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Blog Editor</h1>
          <div>
            <span>Welcome, ${req.user.username}</span>
            <a href="/logout" style="margin-left: 20px; color: #666;">Logout</a>
          </div>
        </div>

        <div class="tabs">
          <button class="tab active" onclick="showTab('blog')">Blog Post</button>
          <button class="tab" onclick="showTab('portfolio')">Portfolio</button>
          <button class="tab" onclick="showTab('draft')">Draft</button>
        </div>

        <!-- Blog Post Form -->
        <div id="blog-tab" class="tab-content active">
          <form id="blog-form" class="form-container">
            <h2>Create Blog Post</h2>
            <div class="grid">
              <div>
                <div class="form-group">
                  <label>Title</label>
                  <input type="text" name="title" required>
                </div>
                <div class="form-group">
                  <label>Subtitle</label>
                  <input type="text" name="subtitle">
                </div>
                <div class="form-group">
                  <label>Cover Image</label>
                  <input type="text" name="cover_image" placeholder="./cover-image.jpg">
                </div>
                <div class="form-group">
                  <label>Tags (comma-separated)</label>
                  <input type="text" name="tags" placeholder="blog, technology, design">
                </div>
              </div>
              <div>
                <div class="form-group">
                  <label>Upload Files</label>
                  <div class="file-upload" id="blog-upload">
                    <p>Drag files here or click to select</p>
                    <input type="file" multiple accept="image/*,video/*" style="display: none;">
                  </div>
                  <div class="preview" id="blog-preview"></div>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label>Content (Markdown)</label>
              <textarea name="content" placeholder="Write your blog post content here..."></textarea>
            </div>
            <button type="submit">Create Blog Post</button>
          </form>
        </div>

        <!-- Portfolio Form -->
        <div id="portfolio-tab" class="tab-content">
          <form id="portfolio-form" class="form-container">
            <h2>Create Portfolio Project</h2>
            <div class="grid">
              <div>
                <div class="form-group">
                  <label>Title</label>
                  <input type="text" name="title" required>
                </div>
                <div class="form-group">
                  <label>Company</label>
                  <input type="text" name="company">
                </div>
                <div class="form-group">
                  <label>Byline</label>
                  <input type="text" name="byline">
                </div>
                <div class="form-group">
                  <label>Year</label>
                  <input type="number" name="year" value="${new Date().getFullYear()}">
                </div>
                <div class="form-group">
                  <label>Location</label>
                  <input type="text" name="location">
                </div>
              </div>
              <div>
                <div class="form-group">
                  <label>Upload Files</label>
                  <div class="file-upload" id="portfolio-upload">
                    <p>Drag files here or click to select</p>
                    <input type="file" multiple accept="image/*,video/*" style="display: none;">
                  </div>
                  <div class="preview" id="portfolio-preview"></div>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label>Problem Description</label>
              <textarea name="problem" placeholder="Describe the problem this project solves..."></textarea>
            </div>
            <div class="form-group">
              <label>Solution Description</label>
              <textarea name="solution" placeholder="Describe your solution..."></textarea>
            </div>
            <div class="form-group">
              <label>Content (Markdown)</label>
              <textarea name="content" placeholder="Write detailed project description..."></textarea>
            </div>
            <button type="submit">Create Portfolio Project</button>
          </form>
        </div>

        <!-- Draft Form -->
        <div id="draft-tab" class="tab-content">
          <form id="draft-form" class="form-container">
            <h2>Create Draft</h2>
            <div class="grid">
              <div>
                <div class="form-group">
                  <label>Title</label>
                  <input type="text" name="title" required>
                </div>
                <div class="form-group">
                  <label>Subtitle</label>
                  <input type="text" name="subtitle">
                </div>
                <div class="form-group">
                  <label>Cover Image</label>
                  <input type="text" name="cover_image" placeholder="./cover-image.jpg">
                </div>
              </div>
              <div>
                <div class="form-group">
                  <label>Upload Files</label>
                  <div class="file-upload" id="draft-upload">
                    <p>Drag files here or click to select</p>
                    <input type="file" multiple accept="image/*,video/*" style="display: none;">
                  </div>
                  <div class="preview" id="draft-preview"></div>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label>Content (Markdown)</label>
              <textarea name="content" placeholder="Write your draft content here..."></textarea>
            </div>
            <button type="submit">Save Draft</button>
          </form>
        </div>

        <div id="status"></div>
      </div>

      <script>
        let currentFiles = { blog: [], portfolio: [], draft: [] };

        function showTab(tabName) {
          // Hide all tabs
          document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
          document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
          
          // Show selected tab
          document.getElementById(tabName + '-tab').classList.add('active');
          event.target.classList.add('active');
        }

        function setupFileUpload(prefix) {
          const uploadArea = document.getElementById(prefix + '-upload');
          const fileInput = uploadArea.querySelector('input[type="file"]');
          const preview = document.getElementById(prefix + '-preview');

          uploadArea.addEventListener('click', () => fileInput.click());
          uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
          });
          uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
          uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            handleFiles(e.dataTransfer.files, prefix);
          });

          fileInput.addEventListener('change', (e) => handleFiles(e.target.files, prefix));
        }

        function handleFiles(files, prefix) {
          Array.from(files).forEach(file => {
            currentFiles[prefix].push(file);
            addPreview(file, prefix);
          });
        }

        function addPreview(file, prefix) {
          const preview = document.getElementById(prefix + '-preview');
          const item = document.createElement('div');
          item.className = 'preview-item';
          
          const removeBtn = document.createElement('button');
          removeBtn.className = 'remove-file';
          removeBtn.innerHTML = '×';
          removeBtn.onclick = () => {
            const index = currentFiles[prefix].indexOf(file);
            if (index > -1) currentFiles[prefix].splice(index, 1);
            item.remove();
          };

          if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            item.appendChild(img);
          } else if (file.type.startsWith('video/')) {
            const video = document.createElement('video');
            video.src = URL.createObjectURL(file);
            video.muted = true;
            item.appendChild(video);
          }

          item.appendChild(removeBtn);
          preview.appendChild(item);
        }

        function showStatus(message, type = 'success') {
          const status = document.getElementById('status');
          status.className = 'status ' + type;
          status.textContent = message;
          setTimeout(() => status.textContent = '', 5000);
        }

        async function submitForm(formId, postType) {
          const form = document.getElementById(formId);
          const formData = new FormData(form);
          
          formData.append('postType', postType);
          
          // Add files
          currentFiles[postType].forEach(file => {
            formData.append('files', file);
          });

          try {
            const response = await fetch('/create-post', {
              method: 'POST',
              body: formData
            });

            const result = await response.text();
            
            if (response.ok) {
              showStatus('Post created successfully!', 'success');
              form.reset();
              currentFiles[postType] = [];
              document.getElementById(postType + '-preview').innerHTML = '';
            } else {
              showStatus('Error: ' + result, 'error');
            }
          } catch (error) {
            showStatus('Error: ' + error.message, 'error');
          }
        }

        // Setup forms
        ['blog', 'portfolio', 'draft'].forEach(type => {
          setupFileUpload(type);
          document.getElementById(type + '-form').addEventListener('submit', (e) => {
            e.preventDefault();
            submitForm(type + '-form', type);
          });
        });
      </script>
    </body>
    </html>
  `);
});

// Post creation endpoint
app.post('/create-post', requireAuth, upload.array('files'), async (req, res) => {
  try {
    const { postType, title, subtitle, content, ...otherFields } = req.body;
    
    if (!title || !content) {
      return res.status(400).send('Title and content are required');
    }

    // Generate slug from title
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const date = new Date().toISOString().split('T')[0];
    const postDir = path.join(process.env.BLOG_PATH, 'source/_posts', slug);
    const postFile = path.join(postDir, 'index.md');

    // Ensure directory exists
    await fs.ensureDir(postDir);

    let frontMatter = {
      title,
      date,
      author: 'Thomas Walichiewicz'
    };

    // Add type-specific fields
    if (postType === 'blog') {
      frontMatter.tags = ['blog'];
      if (subtitle) frontMatter.subtitle = subtitle;
      if (otherFields.cover_image) frontMatter.cover_image = otherFields.cover_image;
      if (otherFields.tags) {
        frontMatter.tags = otherFields.tags.split(',').map(tag => tag.trim());
      }
    } else if (postType === 'portfolio') {
      frontMatter.layout = 'project_gallery';
      frontMatter.tags = ['portfolio'];
      if (otherFields.company) frontMatter.company = otherFields.company;
      if (otherFields.byline) frontMatter.byline = otherFields.byline;
      if (otherFields.year) frontMatter.year = parseInt(otherFields.year);
      if (otherFields.location) frontMatter.location = otherFields.location;
      
      // Add summary structure for portfolio
      if (otherFields.problem || otherFields.solution) {
        frontMatter.summary = {};
        if (otherFields.problem) {
          frontMatter.summary.problem = {
            title: 'The Problem',
            content: otherFields.problem
          };
        }
        if (otherFields.solution) {
          frontMatter.summary.solution = {
            title: 'The Solution',
            content: otherFields.solution
          };
        }
      }
    } else if (postType === 'draft') {
      frontMatter.draft = true;
      if (subtitle) frontMatter.subtitle = subtitle;
      if (otherFields.cover_image) frontMatter.cover_image = otherFields.cover_image;
    }

    // Add gallery images if files were uploaded
    if (req.files && req.files.length > 0) {
      if (postType === 'portfolio') {
        frontMatter.gallery_images = req.files.map(file => ({
          type: file.mimetype.startsWith('video/') ? 'video' : 'image',
          url: './' + file.filename,
          caption: file.originalname.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ')
        }));
      }
    }

    // Create the markdown file
    const fileContent = matter.stringify(content, frontMatter);
    await fs.writeFile(postFile, fileContent, 'utf8');

    res.send('Post created successfully!');
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).send('Error creating post: ' + error.message);
  }
});

// Error handling
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).send('Internal server error');
});

app.listen(PORT, () => {
  console.log(`Blog editor running on http://localhost:${PORT}`);
  console.log('Make sure to configure your .env file with GitHub OAuth credentials');
});
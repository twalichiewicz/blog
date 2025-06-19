# Blog Editor

A secure web-based interface for creating blog posts remotely when you don't have access to your local development environment.

## Features

- **Secure Authentication**: GitHub OAuth with user restriction
- **Multiple Post Types**: Blog posts, portfolio projects, and drafts
- **File Upload**: Drag-and-drop image and video uploads
- **Mobile Responsive**: Works on phones and tablets
- **Real-time Preview**: File preview before upload
- **Rate Limited**: Protection against abuse
- **Security Headers**: Helmet.js protection

## Setup Instructions

### 1. Install Dependencies

```bash
cd tools/blog-editor
npm install
```

### 2. Create GitHub OAuth App

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - Application name: "Blog Editor"
   - Homepage URL: `http://localhost:3001` (or your domain)
   - Authorization callback URL: `http://localhost:3001/auth/github/callback`
4. Note down the Client ID and Client Secret

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your values:
- `GITHUB_CLIENT_ID`: From your OAuth app
- `GITHUB_CLIENT_SECRET`: From your OAuth app  
- `SESSION_SECRET`: Generate a random string
- `AUTHORIZED_USER`: Your GitHub username
- `BLOG_PATH`: Absolute path to your blog directory

### 4. Start the Server

```bash
# Development
npm run dev

# Production
npm start
```

The editor will be available at `http://localhost:3001`

## Usage

1. Navigate to the editor URL
2. Login with your GitHub account
3. Select post type (Blog, Portfolio, or Draft)
4. Fill in the form fields
5. Upload any images/videos by dragging them to the upload area
6. Write your content in Markdown
7. Click "Create" to save the post

## Security Features

- Only authorized GitHub user can access
- Rate limiting (100 requests per 15 minutes)
- File type restrictions (images and videos only)
- File size limits (50MB per file, 10 files max)
- Secure headers with Helmet.js
- Session-based authentication
- CSRF protection via same-origin policy

## File Structure

Posts are created in `source/_posts/{slug}/index.md` with uploaded files in the same directory.

## Deployment Options

### Option 1: VPS/Server
Deploy to a VPS with a domain and SSL certificate for remote access.

### Option 2: Ngrok (Development)
```bash
# Install ngrok
npm install -g ngrok

# Start the server
npm start

# In another terminal, expose it
ngrok http 3001
```

Update your GitHub OAuth app callback URL to the ngrok URL.

### Option 3: Railway/Heroku
Deploy to a platform service for permanent remote access.

## Troubleshooting

- **OAuth errors**: Check callback URL matches exactly
- **File upload fails**: Check disk space and permissions
- **Access denied**: Verify AUTHORIZED_USER matches your GitHub username
- **Session issues**: Check SESSION_SECRET is set and persistent

## Security Notes

- Never commit the `.env` file
- Use strong session secrets
- Consider IP whitelisting for production
- Regular security updates for dependencies
- Monitor logs for suspicious activity
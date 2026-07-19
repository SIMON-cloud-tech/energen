const cloudinary = require('./cloudinary');
const fs = require('fs');

/**
 * Upload an image to Cloudinary and delete the local file
 * 
 * ── What this does ──
 * 1. Takes a local image file path
 * 2. Uploads it to Cloudinary with auto-resize to 800x800px
 * 3. Deletes the local file after successful upload
 * 4. Returns the secure Cloudinary URL for use in your app
 * 
 * ── Why 800x800? ──
 * - Products, blogs, and projects all display well at 800x800
 * - Small enough for fast loading (under 100KB typically)
 * - Large enough for retina displays and zoom
 * - Consistent sizing across all card layouts
 * 
 * @param {string} filePath - Local path to the image file (from Multer)
 * @param {string} folder - Folder name in Cloudinary (e.g., 'products', 'blogs', 'projects')
 * @returns {string} - Secure URL of the uploaded image
 */
const uploadToCloudinary = async (filePath, folder = 'energen') => {
  try {
    // ── Upload the file to Cloudinary with auto-resize ──
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,                    // Organises images into folders (e.g., 'energen/products')
      use_filename: true,               // Preserves the original filename (makes debugging easier)
      unique_filename: true,            // Adds a random string to prevent name collisions
      
      // ── TRANSFORMATION: Resize to 800x800 ──
      transformation: [
        { 
          width: 800,                   // Maximum width (pixels)
          height: 800,                  // Maximum height (pixels)
          crop: 'limit',                // Keeps aspect ratio, fits within 800x800 box
          quality: 'auto',              // Cloudinary auto-optimises quality vs file size
          fetch_format: 'auto'          // Serves WebP to modern browsers, JPEG fallback
        }
      ]
    });

    // ── Delete the local file after successful upload ──
    // This keeps the Render filesystem clean and saves space
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`🗑️ Deleted local file: ${filePath}`);
    }

    // ── Return the secure URL ──
    // Example: https://res.cloudinary.com/j9odce4f/image/upload/c_limit,h_800,q_auto,w_800/v1234567890/energen/products/abc.jpg
    return result.secure_url;
    
  } catch (err) {
    // ── If upload fails, log the error and re-throw ──
    // The calling controller will catch this and return a 500 response
    console.error('❌ Cloudinary upload error:', err);
    throw err;
  }
};

module.exports = uploadToCloudinary;

import multer from "multer";
import path from "path";

// Set storage engine and destination for the uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the folder to store the uploaded images
  },
  filename: (req, file, cb) => {
    // Ensure unique filenames by adding timestamp or unique identifier
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Initialize multer with storage settings
const upload = multer({ storage });

// Create the "uploads" folder if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// POST API to handle image uploads
app.post('/upload', upload.single('image'), (req, res) => {
  try {
    // If no file was uploaded, return an error
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Create the file URL (assuming you're hosting the static files)
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    // Return the image URL
    res.status(200).json({ message: 'Image uploaded successfully', imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Serve static files from the "uploads" folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

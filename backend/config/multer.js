import multer from "multer";

const storage = multer.memoryStorage(); // Store the file in memory as a buffer
const upload = multer({ storage }); // Use memory storage for uploads

export default upload;

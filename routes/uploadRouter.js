const express =require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');

const storage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, 'public/images');
    },
    filename:(re, file, cb) => {
        cb(null, file.originalname)
    }
}
);

const imageFileFilter = (req, file, cb) =>{
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        return cb(new Error('Only image files may be uploaded'), false);
    }
    cb (null, true);
};

const upload = multer({storage: storage, fileFilter: imageFileFilter})

const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
.post(authenticate.verifyUser, upload.single('imageFile'), (req, res, next) => {
        authenticate.verifyAdmin(req,next);  
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(req.file);
    })
.get(authenticate.verifyUser, (req,res,next) => {
    authenticate.verifyAdmin(req,next);  
    res.statusCode=403;
    res.end('GET opeation not supported on /imageupload');
})
.delete(authenticate.verifyUser, (req,res,next) => {
    authenticate.verifyAdmin(req,next);  
    res.statusCode=403;
    res.end('Delete opeation not supported on /imageupload');
})
.put(authenticate.verifyUser, (req,res,next) => {
    authenticate.verifyAdmin(req,next);  
    res.statusCode=403;
    res.end('PUT opeation not supported on /imageupload');
})



module.exports = uploadRouter
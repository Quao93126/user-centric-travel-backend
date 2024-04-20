const path = require('path');
const cityImgUploadController = {
    show: (req,res) => {
        const filename = req.params.filename;
        const imgpath = path.join(__dirname, '../../uploads', 'cityImg', filename);
        res.sendFile(imgpath);
    },  
}

module.exports = cityImgUploadController
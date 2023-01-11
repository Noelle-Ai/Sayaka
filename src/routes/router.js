const { Router } = require('express');
const canvas = require('canvas');
const jimp = require('jimp');
const path = require('path');
const stackblur = require('stackblur-canvas');

const router = Router();

router.get('/blur', (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({ error: 'Image url is required' });
    }

    canvas
        .loadImage(url)
        .then((img) => {
            const Canvas = canvas.createCanvas(img.width, img.height);
            const ctx = Canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            stackblur.canvasRGBA(Canvas, 0, 0, img.width, img.height, 10);
            res.set('Content-Type', 'image/png');
            return Canvas.createPNGStream().pipe(res);
        })
        .catch((error) => {
            res.status(500).json({
                message: 'Something went wrong. Please check your URL',
            });
        });
});

router.get('/invert', (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({ error: 'Image url is required' });
    }

    canvas
        .loadImage(url)
        .then((img) => {
            const Canvas = canvas.createCanvas(img.width, img.height);
            const ctx = Canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                data[i] = 255 - data[i];
                data[i + 1] = 255 - data[i + 1];
            }

            ctx.putImageData(imageData, 0, 0);
            res.set('Content-Type', 'image/png');
            return Canvas.createPNGStream().pipe(res);
        })
        .catch((error) => {
            res.status(500).json({
                message: 'Something went wrong. Please check your URL',
            });
        });
});

router.get('/lgbt', (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({ error: 'Image url is required' });
    }

    canvas
        .loadImage(url)
        .then((img) => {
            jimp.read(path.join(__dirname, '..', '..', 'assets', 'img', 'lgbt.png'), (err, lgbt) => {
                if (err) throw err;
                lgbt.opacity(0.5);

                const Canvas = canvas.createCanvas(img.width, img.height);
                const ctx = Canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const lgbtCanvas = canvas.createCanvas(img.width, img.height);
                lgbtCanvas.height = lgbt.bitmap.height;
                lgbtCanvas.width = lgbt.bitmap.width;

                const lgbtCtx = lgbtCanvas.getContext('2d');
                lgbt.getBase64(jimp.MIME_PNG, (err, src) => {
                    if (err) throw err;
                    canvas.loadImage(src).then((image) => {
                        lgbtCtx.drawImage(image, 0, 0, lgbtCanvas.width, lgbtCanvas.height);
                        ctx.drawImage(lgbtCanvas, 0, 0, img.width, img.height);
                        res.set('Content-Type', 'image/png');
                        return Canvas.createPNGStream().pipe(res);
                    });
                });
            });
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                message: 'Something went wrong. Please check your URL',
            });
        });
});

module.exports = router;

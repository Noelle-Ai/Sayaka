const { Router } = require('express');
const canvas = require('canvas');
const StackBlur = require('stackblur-canvas');

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
            StackBlur.canvasRGBA(Canvas, 0, 0, img.width, img.height, 10);
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

module.exports = router;

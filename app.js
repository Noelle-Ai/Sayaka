const express = require('express');
const app = express();
const Canvas = require('canvas');
const StackBlur = require('stackblur-canvas');

app.listen(1111, () => {
    console.log('API listening on port 1111');
});

app.get('/api/blur', (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({ error: 'Image url is required' });
    }

    Canvas.loadImage(url)
        .then((img) => {
            const canvas = Canvas.createCanvas(img.width, img.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            StackBlur.canvasRGBA(canvas, 0, 0, img.width, img.height, 10);
            res.set('Content-Type', 'image/png');
            return canvas.createPNGStream().pipe(res);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error });
        });
});

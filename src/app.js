const app = express();
const bodyParser = require('body-parser');
const canvas = require('canvas');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const StackBlur = require('stackblur-canvas');

const rateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10000,
    message: 'Too many requests, try it later',
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(rateLimiter);

app.get('/api/blur', (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({ error: 'Image url is required' });
    }

    canvas
        .loadImage(url)
        .then((img) => {
            const canvas = canvas.createCanvas(img.width, img.height);
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

module.exports = app;

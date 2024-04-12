const fs = require('fs');
const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const NodeCache = require('node-cache');

const imageCache = new NodeCache();

function getImageFromCacheOrFile(imagePath) {
    const cachedImage = imageCache.get(imagePath);

    if (cachedImage) {
        return cachedImage;
    } else {
        const imageBuffer = fs.readFileSync(imagePath);
        imageCache.set(imagePath, imageBuffer);
        return imageBuffer;
    }
}


async function getImageFromCacheOrS3(bucket, key) {
    const cacheKey = `${bucket}/${key}`;
    const cachedImage = imageCache.get(cacheKey);

    if (cachedImage) {
        return cachedImage;
    } else {
        const params = { Bucket: bucket, Key: key };
        const s3Object = await S3.getObject(params).promise();
        const imageBuffer = s3Object.Body;
        imageCache.set(cacheKey, imageBuffer);
        return imageBuffer;
    }
}

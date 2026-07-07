const sharp = require('sharp');

async function processImageBuffer(buffer, maxWidth = 1200, maxHeight = 1200, defaultFormat = 'jpeg') {
  try {
    const image = sharp(buffer);
    const metadata = await image.metadata();

    let outputFormat = defaultFormat;
    if (metadata.format === 'png' || metadata.format === 'gif') {
      outputFormat = metadata.format;
    }

    const resized = image.resize({
      width: metadata.width > maxWidth ? maxWidth : null,
      height: metadata.height > maxHeight ? maxHeight : null,
      fit: 'inside',
      withoutEnlargement: true
    });

    let outputBuffer;
    let mime;

    if (outputFormat === 'png') {
      outputBuffer = await resized.png({ quality: 90 }).toBuffer();
      mime = 'image/png';
    } else if (outputFormat === 'gif') {
      outputBuffer = await resized.gif().toBuffer();
      mime = 'image/gif';
    } else {
      outputBuffer = await resized.jpeg({ quality: 85, progressive: true }).toBuffer();
      mime = 'image/jpeg';
    }

    return { buffer: outputBuffer, mime };
  } catch (err) {
    console.error('Erreur traitement image:', err.message);
    return { buffer, mime: 'image/jpeg' };
  }
}

async function processImageFile(filePath, maxWidth = 1200, maxHeight = 1200) {
  try {
    const buffer = require('fs').readFileSync(filePath);
    return await processImageBuffer(buffer, maxWidth, maxHeight);
  } catch (err) {
    console.error('Erreur lecture fichier image:', err.message);
    return null;
  }
}

async function processBase64Image(base64Uri, maxWidth = 1200, maxHeight = 1200) {
  if (!base64Uri || !base64Uri.startsWith('data:')) return base64Uri;
  const match = base64Uri.match(/^data:(image\/\w+);base64,(.*)$/);
  if (!match) return base64Uri;
  try {
    const buffer = Buffer.from(match[2], 'base64');
    const { buffer: outBuffer, mime } = await processImageBuffer(buffer, maxWidth, maxHeight);
    return `data:${mime};base64,${outBuffer.toString('base64')}`;
  } catch (err) {
    console.error('Erreur traitement base64:', err.message);
    return base64Uri;
  }
}

function getMimeFromExt(ext) {
  switch (ext.toLowerCase()) {
    case '.png': return 'image/png';
    case '.gif': return 'image/gif';
    case '.svg': return 'image/svg+xml';
    case '.webp': return 'image/webp';
    default: return 'image/jpeg';
  }
}

module.exports = {
  processImageBuffer,
  processImageFile,
  processBase64Image,
  getMimeFromExt
};

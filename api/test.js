// api/test.js
import fs from 'fs'; // 用于读取文件
import path from 'path'; // 用于处理文件路径
import { fileURLToPath } from 'url'; // 用于在 ES 模块中获取 __dirname

// 获取 dist 目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '..', 'dist');

export default async function handler(req, res) {
  // 1. 获取 URL 中的时间戳参数
  const { t } = req.query;

  if (!t || isNaN(t)) {
    return res.status(400).send('Invalid link: Missing or invalid timestamp.');
  }

  const creationTime = parseInt(t, 10);
  const currentTime = Math.floor(Date.now() / 1000); // 秒
  const timeDiff = currentTime - creationTime; // 秒
  const TWENTY_FOUR_HOURS = 24 * 60 * 60; // 24小时的秒数

  if (timeDiff >= TWENTY_FOUR_HOURS) {
    // 链接已过期
    res.status(410).send(`
        <html>
        <head><title>链接已过期</title></head>
        <body>
            <h1>抱歉，此链接已过期 (24小时有效期)。</h1>
            <p>Please request a new access link.</p>
        </body>
        </html>
    `);
    return;
  }

  // 2. 链接有效，读取并返回 index.html
  const indexPath = path.join(distPath, 'index.html');

  try {
    const htmlContent = fs.readFileSync(indexPath, 'utf8');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(htmlContent);
  } catch (error) {
    console.error('Error reading index.html:', error);
    res.status(500).send('Internal Server Error');
  }
}

// Vercel 需要知道如何处理静态资源 (CSS, JS, images)
export const config = {
  api: {
    responseLimit: '10mb', // 如果你的静态文件很大，可能需要调整
  },
};
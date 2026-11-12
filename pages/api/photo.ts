import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || typeof id !== 'string') return res.status(400).end();

  try {
    const driveRes = await fetch(
      `https://drive.google.com/uc?export=view&id=${id}`,
      { headers: { 'User-Agent': 'Mozilla/5.0' }, redirect: 'follow' }
    );

    if (!driveRes.ok) return res.status(driveRes.status).end();

    const contentType = driveRes.headers.get('content-type') || 'image/jpeg';
    const buffer = await driveRes.arrayBuffer();

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(Buffer.from(buffer));
  } catch {
    res.status(500).end();
  }
}

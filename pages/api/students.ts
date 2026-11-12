import type { NextApiRequest, NextApiResponse } from 'next';

const API_URL = process.env.ADMISSION_API_URL || 'https://admission-api.odpay.in';
const MOBILE = process.env.MOBILE || '5533989898';
const PASSWORD = process.env.PASSWORD || '5533989898';
const ENTITY_ID = process.env.ENTITY_ID || '69ca46dfa7f858000f1867ff';
const SESSION = process.env.SESSION || '2027-28';

async function getToken(): Promise<string> {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile: MOBILE, password: PASSWORD }),
  });
  const data = await res.json();
  if (!data.token) throw new Error('Login failed: ' + JSON.stringify(data));
  return data.token;
}

async function fetchAllStudents(token: string): Promise<unknown[]> {
  const pageSize = 100;
  let page = 1;
  let all: unknown[] = [];

  while (true) {
    const res = await fetch(`${API_URL}/api/list/admissionStudentData`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: token },
      body: JSON.stringify({
        entity: ENTITY_ID,
        session: SESSION,
        page,
        limit: pageSize,
      }),
    });
    const data = await res.json();
    const batch: unknown[] = data.data || [];
    all = all.concat(batch);
    if (batch.length < pageSize) break;
    page++;
  }

  return all;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const token = await getToken();
    const students = await fetchAllStudents(token);

    // Sort by applicationFormNumber (roll no) numerically
    students.sort((a: unknown, b: unknown) => {
      const aObj = a as Record<string, unknown>;
      const bObj = b as Record<string, unknown>;
      const aNum = parseInt(String(aObj.applicationNumber || aObj.applicationFormNumber || aObj.formNo || aObj.rollNo || 0), 10);
      const bNum = parseInt(String(bObj.applicationNumber || bObj.applicationFormNumber || bObj.formNo || bObj.rollNo || 0), 10);
      return aNum - bNum;
    });

    res.status(200).json({
      students,
      total: students.length,
      entity: ENTITY_ID,
      session: SESSION,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: msg });
  }
}

import { GetServerSideProps } from 'next';
import Head from 'next/head';

interface Student {
  _id: string;
  applicationNumber?: string | number;
  applicationFormNumber?: string;
  formNo?: string;
  rollNo?: string;
  sourceId?: string;
  name?: string;
  candidateName?: string;
  fatherName?: string;
  lastSchool?: string;
  previousSchool?: string;
  photo?: string;
  passportPhoto?: string;
  profilePhoto?: string;
  studentPhoto?: string;
  address?: string;
  permanentAddress?: string;
  place?: string;
  phone?: string;
  mobile?: string;
  fatherMobile?: string;
  mobileNo?: string;
  contactNo?: string;
  stream?: string;
  course?: string;
  [key: string]: unknown;
}

interface Props {
  students: Student[];
  total: number;
  error?: string;
  schoolName: string;
  schoolAddress: string;
  schoolWebsite: string;
  schoolAffiliation: string;
  examLabel: string;
}

function getRollNo(s: Student): string {
  return String(s.applicationNumber || s.applicationFormNumber || s.formNo || s.rollNo || s.sourceId || '—');
}
function getName(s: Student): string {
  return String(s.name || s.candidateName || '—');
}
function getFatherName(s: Student): string {
  return String(s.fatherName || '—');
}
function getSchool(s: Student): string {
  return String(s.lastSchool || s.previousSchool || '—');
}
function getPhoto(s: Student): string {
  const raw = String(s.photo || s.passportPhoto || s.profilePhoto || s.studentPhoto || '');
  if (!raw) return '';
  if (raw.includes('drive.google.com')) {
    const m = raw.match(/\/d\/([^/]+)\//);
    return m ? `/api/photo?id=${m[1]}` : raw;
  }
  return raw;
}
function getAddress(s: Student): string {
  return String(s.address || s.permanentAddress || s.place || '—');
}
function getMobile(s: Student): string {
  return String(s.phone || s.mobile || s.fatherMobile || s.mobileNo || s.contactNo || '—');
}
function getCourse(s: Student): string {
  return String(s.stream || s.course || '—');
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export default function Home({
  students,
  total,
  error,
  schoolName,
  schoolAddress,
  schoolWebsite,
  schoolAffiliation,
  examLabel,
}: Props) {
  const pages = chunkArray(students, 4);

  const SCHOOL_LOGO = 'https://okiedokie-erp-images.s3.ap-south-1.amazonaws.com/GNAVLKB/2026/04/logo/c126d4d689be2ad475ee-aeb9f3fd1d398ac5eedc-GITA_NIKETAN_AWASIYA_VIDYALAYA-logo%20(1).png';
  const FAVICON = 'https://okiedokie-erp-images.s3.ap-south-1.amazonaws.com/Okie%20Dokie/2025/12/sourceURL/26aebcbe10f4ac5a3e8b-611ed1b9032568edd4f3-Okie_Dokie_App_icon__2___2_-removebg-preview.png';

  return (
    <>
      <Head>
        <title>Attendance Sheet – {schoolName}</title>
        <link rel="icon" href={FAVICON} type="image/png" />
        <style>{`
          * { box-sizing: border-box; }

          /* ── Print ─────────────────────────────── */
          @media print {
            .no-print { display: none !important; }
            body { margin: 0; background: #fff; }
            .page-wrap { background: transparent; padding: 0; }
            .page { margin: 0; box-shadow: none; border-radius: 0; }
            .page-break { page-break-after: always; }
          }

          /* ── Base ───────────────────────────────── */
          body {
            font-family: 'Arial', sans-serif;
            background: #0f172a;
            margin: 0;
          }

          /* ── Top bar ────────────────────────────── */
          .topbar {
            background: linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%);
            padding: 0;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            position: sticky;
            top: 0;
            z-index: 100;
          }
          .topbar-inner {
            max-width: 900px;
            margin: 0 auto;
            padding: 14px 24px;
            display: flex;
            align-items: center;
            gap: 16px;
            flex-wrap: wrap;
          }
          .topbar-title {
            color: #fff;
            font-size: 15px;
            font-weight: 700;
            letter-spacing: 0.3px;
            flex: 1;
            min-width: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .topbar-title span {
            color: #93c5fd;
            font-weight: 400;
            font-size: 13px;
            margin-left: 8px;
          }
          .topbar-actions { display: flex; gap: 10px; align-items: center; }
          .btn {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            padding: 9px 18px;
            border: none;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.15s;
            white-space: nowrap;
          }
          .btn-primary {
            background: #2563eb;
            color: #fff;
          }
          .btn-primary:hover { background: #1d4ed8; transform: translateY(-1px); }
          .btn-secondary {
            background: rgba(255,255,255,0.1);
            color: #e2e8f0;
            border: 1px solid rgba(255,255,255,0.15);
          }
          .btn-secondary:hover { background: rgba(255,255,255,0.18); }
          .badge {
            background: rgba(34,197,94,0.15);
            border: 1px solid rgba(34,197,94,0.3);
            color: #4ade80;
            border-radius: 20px;
            padding: 4px 12px;
            font-size: 12px;
            font-weight: 600;
            white-space: nowrap;
          }
          .badge-err {
            background: rgba(239,68,68,0.15);
            border-color: rgba(239,68,68,0.3);
            color: #f87171;
          }

          /* ── Page wrap ──────────────────────────── */
          .page-wrap {
            background: #0f172a;
            padding: 28px 16px 48px;
          }

          /* ── A4 page ────────────────────────────── */
          .page {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto 24px;
            background: #fff;
            padding: 10mm 10mm 8mm;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            border-radius: 4px;
          }

          /* ── School header ──────────────────────── */
          .school-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 6px;
            border-bottom: 2px solid #1e3a5f;
            padding-bottom: 6px;
          }
          .school-logo {
            width: 52px;
            height: 52px;
            object-fit: contain;
            flex-shrink: 0;
          }
          .school-info { text-align: center; flex: 1; }
          .school-name { font-size: 15pt; font-weight: 900; letter-spacing: 0.5px; color: #1e3a5f; line-height: 1.2; }
          .school-addr { font-size: 9pt; color: #334155; margin-top: 1px; }
          .school-web { font-size: 8pt; color: #64748b; }

          /* ── Meta row ───────────────────────────── */
          .meta-row {
            display: flex;
            justify-content: space-between;
            font-size: 8.5pt;
            color: #475569;
            margin: 4px 0 2px;
          }

          /* ── Sheet title ────────────────────────── */
          .sheet-title {
            text-align: center;
            font-size: 13pt;
            font-weight: 800;
            margin: 5px 0;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #0f172a;
            border-top: 1px solid #cbd5e1;
            border-bottom: 1px solid #cbd5e1;
            padding: 3px 0;
          }

          /* ── Student table ──────────────────────── */
          .student-table { width: 100%; border-collapse: collapse; margin-top: 6px; }
          .student-row { border: 1.5px solid #334155; }
          .student-row + .student-row { border-top: none; }
          .student-cell { vertical-align: top; padding: 6px 7px; }
          .student-left { width: 54%; border-right: 1px solid #334155; }
          .student-right { width: 44%; }

          .sno {
            display: inline-block;
            background: #1e3a5f;
            color: #fff;
            font-size: 7pt;
            font-weight: 700;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            line-height: 16px;
            text-align: center;
            margin-right: 4px;
            vertical-align: middle;
          }

          .field-row { margin-bottom: 4px; }
          .field-label {
            font-size: 7.5pt;
            color: #64748b;
            min-width: 88px;
            display: inline-block;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }
          .field-value {
            font-size: 9pt;
            font-weight: 700;
            color: #0f172a;
            border-bottom: 1px solid #cbd5e1;
            display: inline-block;
            min-width: 110px;
            line-height: 1.4;
          }

          /* ── Photo cell ─────────────────────────── */
          .photo-cell {
            width: 72px;
            text-align: center;
            padding: 5px 4px;
            border-left: 1px solid #334155;
            border-right: 1px solid #334155;
            vertical-align: top;
          }
          .photo-box {
            width: 62px;
            height: 78px;
            border: 1.5px solid #94a3b8;
            border-radius: 2px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            background: #f8fafc;
          }
          .photo-box img { width: 100%; height: 100%; object-fit: cover; }
          .photo-placeholder { font-size: 7pt; color: #94a3b8; text-align: center; }

          /* ── Signature ──────────────────────────── */
          .sig-label { font-size: 7.5pt; color: #64748b; text-transform: uppercase; letter-spacing: 0.3px; }
          .sig-box {
            border: 1px solid #94a3b8;
            border-radius: 2px;
            height: 36px;
            margin-top: 4px;
            background: #fafafa;
          }

          /* ── Footer ─────────────────────────────── */
          .footer-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 8px;
            border-top: 1.5px solid #334155;
            padding-top: 5px;
            font-size: 8.5pt;
            color: #0f172a;
          }
          .footer-item { flex: 1; }

          /* ── Error / Empty ──────────────────────── */
          .error-box {
            max-width: 600px;
            margin: 32px auto;
            background: rgba(239,68,68,0.1);
            border: 1px solid rgba(239,68,68,0.3);
            color: #fca5a5;
            padding: 16px 20px;
            border-radius: 10px;
            font-size: 14px;
          }
          .empty-box {
            text-align: center;
            padding: 80px 24px;
            color: #94a3b8;
          }
          .empty-box h2 { color: #cbd5e1; margin-bottom: 8px; }
        `}</style>
      </Head>

      {/* Top bar */}
      <div className="no-print topbar">
        <div className="topbar-inner">
          <div className="topbar-title">
            {schoolName}
            <span>Attendance Sheet</span>
          </div>
          <div className="topbar-actions">
            <span className={`badge ${error ? 'badge-err' : ''}`}>
              {error ? `Error` : `${total} students`}
            </span>
            <button className="btn btn-secondary" onClick={() => window.location.reload()}>
              ↺ Refresh
            </button>
            <button className="btn btn-primary" onClick={() => window.print()}>
              🖨 Print
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="page-wrap no-print">
          <div className="error-box">
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

      {!error && total === 0 && (
        <div className="page-wrap no-print">
          <div className="empty-box">
            <h2>No students found</h2>
            <p>No admission records for session 2027-28.</p>
          </div>
        </div>
      )}

      <div className="page-wrap">
        {pages.map((pageStudents, pageIdx) => (
          <div
            key={pageIdx}
            className={`page ${pageIdx < pages.length - 1 ? 'page-break' : ''}`}
          >
            {/* School header */}
            <div className="school-header">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={SCHOOL_LOGO} alt="logo" className="school-logo" />
              <div className="school-info">
                <div className="school-name">{schoolName}</div>
                <div className="school-addr">{schoolAddress}</div>
                <div className="school-web">{schoolWebsite}</div>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={SCHOOL_LOGO} alt="logo" className="school-logo" />
            </div>

            <div className="meta-row">
              <span>{schoolAffiliation}</span>
              <span>{examLabel}</span>
            </div>

            <div className="sheet-title">Attendance Sheet</div>

            {/* Students */}
            <table className="student-table">
              <tbody>
                {pageStudents.map((student, idx) => (
                  <tr key={student._id} className="student-row">
                    <td className="student-cell student-left">
                      <div className="field-row">
                        <span className="sno">{pageIdx * 4 + idx + 1}</span>
                        <span className="field-label">Roll No.</span>
                        <span className="field-value">{getRollNo(student)}</span>
                      </div>
                      <div className="field-row">
                        <span className="field-label">Candidate Name</span>
                        <span className="field-value">{getName(student)}</span>
                      </div>
                      <div className="field-row">
                        <span className="field-label">Father&apos;s Name</span>
                        <span className="field-value">{getFatherName(student)}</span>
                      </div>
                      <div className="field-row">
                        <span className="field-label">School</span>
                        <span className="field-value" style={{ wordBreak: 'break-word', maxWidth: 175 }}>{getSchool(student)}</span>
                      </div>
                      <div className="field-row">
                        <span className="field-label">Class Applied</span>
                        <span className="field-value">{getCourse(student)}</span>
                      </div>
                    </td>

                    <td className="photo-cell">
                      <div className="photo-box">
                        {getPhoto(student) ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={getPhoto(student)} alt="photo" />
                        ) : (
                          <div className="photo-placeholder">Photo</div>
                        )}
                      </div>
                    </td>

                    <td className="student-cell student-right">
                      <div className="field-row">
                        <span className="field-label">Place</span>
                        <span className="field-value" style={{ wordBreak: 'break-word', maxWidth: 145 }}>{getAddress(student)}</span>
                      </div>
                      <div className="field-row">
                        <span className="field-label">Mobile</span>
                        <span className="field-value">{getMobile(student)}</span>
                      </div>
                      <div className="field-row" style={{ marginTop: 6 }}>
                        <span className="sig-label">Candidate Signature</span>
                        <div className="sig-box" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Footer */}
            <div className="footer-row">
              <div className="footer-item">Present : ____________</div>
              <div className="footer-item" style={{ textAlign: 'center' }}>Absent : ____________</div>
              <div className="footer-item" style={{ textAlign: 'center' }}>Invigilator Signature</div>
              <div className="footer-item" style={{ textAlign: 'right' }}>
                Page {pageIdx + 1} / {pages.length}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const API_URL = process.env.ADMISSION_API_URL || 'https://admission-api.odpay.in';
  const MOBILE = process.env.MOBILE || '5533989898';
  const PASSWORD = process.env.PASSWORD || '5533989898';
  const ENTITY_ID = process.env.ENTITY_ID || '69ca46dfa7f858000f1867ff';
  const SESSION = process.env.SESSION || '2027-28';

  const schoolName = process.env.SCHOOL_NAME || 'GITA NIKETAN AWASIYA VIDYALAYA';
  const schoolAddress = process.env.SCHOOL_ADDRESS || 'Salarpur Road, Kurukshetra';
  const schoolWebsite = process.env.SCHOOL_WEBSITE || 'www.gitaniketan.org';
  const schoolAffiliation = process.env.SCHOOL_AFFILIATION || 'Affiliated to CBSE';
  const examLabel = process.env.EXAM_LABEL || 'Entrance Exam-2026-27';

  try {
    // Login
    const loginRes = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile: MOBILE, password: PASSWORD }),
    });
    const loginData = await loginRes.json();
    if (!loginData.token) throw new Error('Login failed');

    const token: string = loginData.token;

    // Fetch all students (paginated)
    const pageSize = 100;
    let page = 1;
    let students: Student[] = [];

    while (true) {
      const r = await fetch(`${API_URL}/api/list/admissionStudentData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: token },
        body: JSON.stringify({ entity: ENTITY_ID, session: SESSION, page, limit: pageSize }),
      });
      const d = await r.json();
      const batch: Student[] = d.data || [];
      students = students.concat(batch);
      if (batch.length < pageSize) break;
      page++;
    }

    // Sort by roll number
    students.sort((a, b) => {
      const aNum = parseInt(String(a.applicationNumber || a.applicationFormNumber || a.formNo || a.rollNo || 0), 10);
      const bNum = parseInt(String(b.applicationNumber || b.applicationFormNumber || b.formNo || b.rollNo || 0), 10);
      return aNum - bNum;
    });

    return {
      props: {
        students,
        total: students.length,
        schoolName,
        schoolAddress,
        schoolWebsite,
        schoolAffiliation,
        examLabel,
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      props: {
        students: [],
        total: 0,
        error: msg,
        schoolName,
        schoolAddress,
        schoolWebsite,
        schoolAffiliation,
        examLabel,
      },
    };
  }
};

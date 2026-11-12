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
  rawFields: string[];
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
  rawFields,
}: Props) {
  const pages = chunkArray(students, 4);

  return (
    <>
      <Head>
        <title>Attendance Sheet – {schoolName}</title>
        <style>{`
          @media print {
            .no-print { display: none !important; }
            body { margin: 0; }
            .page-break { page-break-after: always; }
          }
          body { font-family: Arial, sans-serif; background: #f5f5f5; }
          .controls { padding: 20px; background: #fff; border-bottom: 1px solid #ddd; }
          .controls button {
            padding: 10px 24px;
            background: #1a56db;
            color: #fff;
            border: none;
            border-radius: 6px;
            font-size: 15px;
            cursor: pointer;
            margin-right: 10px;
          }
          .controls button:hover { background: #1240ab; }
          .meta { color: #555; margin-left: 10px; font-size: 14px; }
          .page {
            width: 210mm;
            min-height: 297mm;
            margin: 20px auto;
            background: #fff;
            padding: 12mm 10mm;
            box-sizing: border-box;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .school-header { text-align: center; margin-bottom: 8px; }
          .school-name { font-size: 16pt; font-weight: bold; letter-spacing: 1px; }
          .school-addr { font-size: 10pt; }
          .school-web { font-size: 9pt; }
          .affiliation { font-size: 9pt; float: left; }
          .exam-label { font-size: 9pt; float: right; }
          .clear { clear: both; }
          .sheet-title {
            text-align: center;
            font-size: 14pt;
            font-weight: bold;
            margin: 6px 0;
            text-decoration: underline;
          }
          .student-table { width: 100%; border-collapse: collapse; }
          .student-row { border: 1px solid #000; }
          .student-cell { vertical-align: top; padding: 5px; }
          .student-left { width: 55%; border-right: 1px solid #000; }
          .student-right { width: 45%; }
          .field-row { margin-bottom: 3px; font-size: 9pt; }
          .field-label { font-size: 8pt; color: #333; min-width: 85px; display: inline-block; }
          .field-value { font-size: 9pt; font-weight: bold; border-bottom: 1px solid #aaa; display: inline-block; min-width: 120px; }
          .photo-cell {
            width: 70px;
            text-align: center;
            padding: 4px;
            border-left: 1px solid #000;
            border-right: 1px solid #000;
            vertical-align: top;
          }
          .photo-box {
            width: 60px;
            height: 75px;
            border: 1px solid #aaa;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            background: #f9f9f9;
          }
          .photo-box img { width: 100%; height: 100%; object-fit: cover; }
          .photo-placeholder { font-size: 7pt; color: #aaa; text-align: center; }
          .sig-label { font-size: 8pt; color: #333; margin-bottom: 3px; }
          .sig-box { border: 1px solid #aaa; height: 35px; margin-top: 3px; }
          .footer-row { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; border-top: 1px solid #000; padding-top: 5px; font-size: 9pt; }
          .footer-item { flex: 1; }
          .error-box { background: #fff3cd; border: 1px solid #ffc107; padding: 16px; margin: 20px; border-radius: 6px; }
          .empty-box { text-align: center; padding: 60px; color: #666; }
          .debug-section { margin: 20px; padding: 16px; background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 6px; font-size: 12px; }
          .raw-fields { background: #272822; color: #f8f8f2; padding: 12px; border-radius: 4px; font-family: monospace; white-space: pre-wrap; }
        `}</style>
      </Head>

      <div className="no-print controls">
        <button onClick={() => window.print()}>🖨️ Print Attendance Sheet</button>
        <button onClick={() => window.location.reload()}>🔄 Refresh Data</button>
        <span className="meta">
          {error
            ? `❌ Error: ${error}`
            : `✅ ${total} student${total !== 1 ? 's' : ''} loaded`}
        </span>
      </div>

      {error && (
        <div className="error-box no-print">
          <strong>API Error:</strong> {error}
        </div>
      )}

      {!error && total === 0 && (
        <div className="empty-box no-print">
          <p>No students found for entity <code>{process.env.NEXT_PUBLIC_ENTITY_ID}</code> / session <code>{process.env.NEXT_PUBLIC_SESSION}</code>.</p>
          <p>Check that the ENTITY_ID and SESSION environment variables are correct.</p>
          {rawFields.length > 0 && (
            <div className="debug-section" style={{ textAlign: 'left', marginTop: 20 }}>
              <strong>Sample student field names (from first record):</strong>
              <pre className="raw-fields">{rawFields.join('\n')}</pre>
            </div>
          )}
        </div>
      )}

      {pages.map((pageStudents, pageIdx) => (
        <div
          key={pageIdx}
          className={`page ${pageIdx < pages.length - 1 ? 'page-break' : ''}`}
        >
          {/* Header */}
          <div className="school-header">
            <div className="school-name">{schoolName}</div>
            <div className="school-addr">{schoolAddress}</div>
            <div className="school-web">{schoolWebsite}</div>
          </div>
          <div>
            <span className="affiliation">{schoolAffiliation}</span>
            <span className="exam-label">{examLabel}</span>
          </div>
          <div className="clear" />
          <div className="sheet-title">ATTENDANCE SHEET</div>

          {/* Students */}
          <table className="student-table">
            <tbody>
              {pageStudents.map((student) => (
                <tr key={student._id} className="student-row">
                  {/* Left: student details */}
                  <td className="student-cell student-left">
                    <div className="field-row">
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
                      <span className="field-value" style={{ wordBreak: 'break-word', maxWidth: 180 }}>{getSchool(student)}</span>
                    </div>
                    <div className="field-row">
                      <span className="field-label">Class Applied</span>
                      <span className="field-value">{getCourse(student)}</span>
                    </div>
                  </td>

                  {/* Photo */}
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

                  {/* Right: address + signature */}
                  <td className="student-cell student-right">
                    <div className="field-row">
                      <span className="field-label">Place</span>
                      <span className="field-value" style={{ wordBreak: 'break-word', maxWidth: 150 }}>{getAddress(student)}</span>
                    </div>
                    <div className="field-row">
                      <span className="field-label">Mobile</span>
                      <span className="field-value">{getMobile(student)}</span>
                    </div>
                    <div className="field-row">
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
            <div className="footer-item">Present : ______</div>
            <div className="footer-item" style={{ textAlign: 'center' }}>Absent : ______</div>
            <div className="footer-item" style={{ textAlign: 'center' }}>Invigilator Signature</div>
            <div className="footer-item" style={{ textAlign: 'right' }}>
              Page {pageIdx + 1} of {pages.length}
            </div>
          </div>
        </div>
      ))}

      {/* Debug: raw fields (no-print) */}
      {!error && total > 0 && rawFields.length > 0 && (
        <div className="no-print debug-section">
          <strong>API field names (first student):</strong>
          <pre className="raw-fields">{rawFields.join('\n')}</pre>
        </div>
      )}
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

    const rawFields = students.length > 0 ? Object.keys(students[0]) : [];

    return {
      props: {
        students,
        total: students.length,
        schoolName,
        schoolAddress,
        schoolWebsite,
        schoolAffiliation,
        examLabel,
        rawFields,
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
        rawFields: [],
      },
    };
  }
};

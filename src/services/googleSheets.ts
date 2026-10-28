import { GameResult } from '../types/game';
import { getAccessToken } from './googleAuth';

const SPREADSHEET_STORAGE_KEY = 'smande_mario_pancasila_sheet_id';

export interface SheetSyncResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
  isNew: boolean;
  rowNumber: number;
}

/**
 * Creates a formatted Google Sheet for Rekap Nilai Asesmen Sumatif Bab 2
 */
export async function createQuizSpreadsheet(token: string, title?: string): Promise<{ id: string; url: string }> {
  const sheetTitle = title || 'REKAPITULASI NILAI PENDIDIKAN PANCASILA SMAN 1 MANDE - KELAS XI';

  const body = {
    properties: {
      title: sheetTitle,
    },
    sheets: [
      {
        properties: {
          title: 'Rekap Nilai Siswa',
          gridProperties: {
            frozenRowCount: 1,
          },
        },
      },
    ],
  };

  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Gagal membuat Google Spreadsheet baru.');
  }

  const data = await response.json();
  const spreadsheetId = data.spreadsheetId;

  // Insert header row with styling
  const headerValues = [
    [
      'No',
      'Waktu Asesmen',
      'Nama Siswa',
      'Kelas',
      'Nilai Akhir (0-100)',
      'Predikat KKTP',
      'Jawaban Benar',
      'Total Soal',
      'Akurasi (%)',
      'Skor Mario',
      'Koin Terkumpul',
      'Integritas (Pindah Tab)',
      'Deskripsi Capaian Pembelajaran',
      'Guru Pengampu',
      'Sekolah',
    ],
  ];

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Rekap Nilai Siswa'!A1:O1?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values: headerValues }),
    }
  );

  // Apply styling to header row (Blue background, white bold text)
  try {
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: data.sheets[0].properties.sheetId,
                startRowIndex: 0,
                endRowIndex: 1,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.01, green: 0.52, blue: 0.78 }, // Sky Blue
                  textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } },
                  horizontalAlignment: 'CENTER',
                },
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)',
            },
          },
        ],
      }),
    });
  } catch (styleErr) {
    console.warn('Gagal memformat warna header, data tetap tersimpan:', styleErr);
  }

  return {
    id: spreadsheetId,
    url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
  };
}

/**
 * Appends student result as a new row in Google Sheets
 */
export async function appendResultToSpreadsheet(
  spreadsheetId: string,
  result: GameResult,
  token: string
): Promise<number> {
  // Check how many rows exist to calculate index
  let nextRowIndex = 1;
  try {
    const checkRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Rekap Nilai Siswa'!A:A`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (checkRes.ok) {
      const checkData = await checkRes.json();
      if (checkData.values && Array.isArray(checkData.values)) {
        nextRowIndex = checkData.values.length; // e.g. 1 header means next is 1
      }
    }
  } catch {
    // ignore
  }

  const accuracyPct = Math.round((result.correctAnswers / result.totalQuestions) * 100);

  const rowData = [
    [
      nextRowIndex,
      result.completedAt,
      result.student.nama,
      result.student.kelas,
      result.finalGrade,
      result.predicate,
      result.correctAnswers,
      result.totalQuestions,
      `${accuracyPct}%`,
      result.score,
      result.coins,
      result.tabSwitchCount === 0 ? 'Tertib (0)' : `${result.tabSwitchCount} kali buka tab lain`,
      result.description,
      'Munawar Rois, S.Pd.',
      'SMA Negeri 1 Mande',
    ],
  ];

  const appendRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Rekap Nilai Siswa'!A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values: rowData }),
    }
  );

  if (!appendRes.ok) {
    const err = await appendRes.json();
    throw new Error(err.error?.message || 'Gagal menambahkan data nilai ke Google Sheets.');
  }

  return nextRowIndex;
}

/**
 * Primary sync function: Links downloaded result data to Google Sheets
 */
export async function syncResultToGoogleSheets(
  result: GameResult,
  providedSpreadsheetId?: string
): Promise<SheetSyncResult> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Belum masuk akun Google. Silakan klik "Masuk dengan Google" terlebih dahulu.');
  }

  let spreadsheetId = providedSpreadsheetId || localStorage.getItem(SPREADSHEET_STORAGE_KEY) || '';
  let isNew = false;

  // Test if existing spreadsheet is valid and accessible
  if (spreadsheetId) {
    try {
      const testRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!testRes.ok) {
        spreadsheetId = ''; // Reset to create new one if not accessible
      }
    } catch {
      spreadsheetId = '';
    }
  }

  // Create new if no valid sheet found
  if (!spreadsheetId) {
    const created = await createQuizSpreadsheet(token);
    spreadsheetId = created.id;
    isNew = true;
    localStorage.setItem(SPREADSHEET_STORAGE_KEY, spreadsheetId);
  }

  // Append row
  const rowNumber = await appendResultToSpreadsheet(spreadsheetId, result, token);

  return {
    spreadsheetId,
    spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
    isNew,
    rowNumber,
  };
}

export function getSavedSpreadsheetId(): string {
  return localStorage.getItem(SPREADSHEET_STORAGE_KEY) || '';
}

export function saveSpreadsheetId(id: string) {
  localStorage.setItem(SPREADSHEET_STORAGE_KEY, id);
}

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const excelPath = path.join(__dirname, '..', 'BD&WA.xlsx');
if (!fs.existsSync(excelPath)) {
    console.error('ERROR: BD&WA.xlsx not found at:', excelPath);
    process.exit(1);
}

const workbook = XLSX.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const rawData = XLSX.utils.sheet_to_json(sheet, { raw: true });

const monthMap = {
    'january': 'January', 'february': 'February', 'march': 'March',
    'april': 'April', 'may': 'May', 'june': 'June', 'july': 'July',
    'august': 'August', 'september': 'September', 'october': 'October',
    'november': 'November', 'december': 'December'
};

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const celebrations = rawData.map((row, index) => {
    let name = (row.Name || '').trim();
    if (!name) return null;

    let monthRaw = (row.Month || '').trim().toLowerCase();
    let month = monthMap[monthRaw] || 'January';
    
    let eventRaw = (row.Event || '').trim().toLowerCase();
    let event = 'Birthday';
    if (eventRaw.includes('wed') || eventRaw.includes('anniv')) {
        event = 'Wedding Anniversary';
    } else if (eventRaw.includes('birth') || eventRaw.includes('bday') || eventRaw.includes('bady')) {
        event = 'Birthday';
    }

    let day = 1;
    let year = null;
    let dateStr = row.Date + '';

    if (typeof row.Date === 'number' || (!isNaN(row.Date) && Number(row.Date) > 100)) {
        const serial = Number(row.Date);
        const dateObj = new Date((serial - (serial > 60 ? 25569 : 25568)) * 86400 * 1000);
        day = dateObj.getUTCDate();
        const fullYear = dateObj.getUTCFullYear();
        if (fullYear > 1900 && fullYear < 2023) {
            year = fullYear;
        }
    } else {
        const str = String(row.Date || '').trim();
        if (str.includes('/') || str.includes('-') || str.includes(' ')) {
            const parts = str.split(/[\/\- ]+/);
            for (const part of parts) {
                const n = parseInt(part, 10);
                if (!isNaN(n) && n >= 1 && n <= 31) {
                    if (parts.indexOf(part) === 0 || isNaN(parseInt(parts[0], 10))) {
                        day = n;
                        break;
                    }
                }
            }
            if (parts.length >= 3) {
                const yStr = parts[parts.length - 1];
                const y = parseInt(yStr, 10);
                if (!isNaN(y)) {
                    if (y > 30 && y < 100) year = 1900 + y;
                    else if (y >= 0 && y <= 24) year = 2000 + y;
                    else if (y > 1900 && y < 2023) year = y;
                }
            }
        }
    }

    const monthIndex = monthNames.indexOf(month);

    return {
        id: `cel-${index + 1}`,
        name,
        month,
        monthIndex,
        day,
        year,
        event,
        rawDate: dateStr
    };
}).filter(Boolean);

console.log(`Successfully synced ${celebrations.length} records from BD&WA.xlsx.`);

const dataDir = path.join(__dirname, '..', 'src', 'data');
const publicDir = path.join(__dirname, '..', 'public');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

fs.writeFileSync(path.join(dataDir, 'celebrations.json'), JSON.stringify(celebrations, null, 2));
fs.writeFileSync(path.join(publicDir, 'celebrations.json'), JSON.stringify(celebrations, null, 2));
console.log('Saved celebrations.json to src/data/ and public/');

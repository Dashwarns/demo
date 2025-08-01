const { google } = require('googleapis');

exports.handler = async (event, context) => {
    try {
        const auth = new google.auth.GoogleAuth({
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
        });
        const sheets = google.sheets({ version: 'v4', auth });

        const spreadsheetId = process.env.SPREADSHEET_ID;
        const range1 = 'Sheet1!A2:B'; // Untuk Nama admin dan Sisa Uang
        const range2 = 'Sheet1!D1';   // Untuk Total penghasil

        const [response1, response2] = await Promise.all([
            sheets.spreadsheets.values.get({ spreadsheetId, range: range1 }),
            sheets.spreadsheets.values.get({ spreadsheetId, range: range2 })
        ]);

        const admins = response1.data.values;
        const totalPenghasil = response2.data.values[0][0];

        return {
            statusCode: 200,
            body: JSON.stringify({
                admins: admins,
                totalPenghasil: totalPenghasil
            })
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch data' })
        };
    }
};

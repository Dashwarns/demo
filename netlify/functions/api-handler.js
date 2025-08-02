// netlify/functions/api-handler.js
// KODE INI SAMA DENGAN SEBELUMNYA, TIDAK PERLU DIUBAH

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
            headers: { 'Content-Type': 'application/json' }
        };
    }

    const GOOGLE_APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!GOOGLE_APPS_SCRIPT_URL) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Server configuration error: Apps Script URL missing.' }),
            headers: { 'Content-Type': 'application/json' }
        };
    }

    try {
        const payload = JSON.parse(event.body);

        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        return {
            statusCode: response.status,
            body: JSON.stringify(result),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'https://dashwarnstore.netlify.app'
            }
        };

    } catch (error) {
        console.error('Error in Netlify Function:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error', details: error.message }),
            headers: { 'Content-Type': 'application/json' }
        };
    }
};

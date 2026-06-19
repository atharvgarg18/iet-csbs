const https = require('https');

exports.handler = async (event) => {
    const { httpMethod, queryStringParameters, headers } = event;

    const origin = headers.origin || headers.referer || '*';
    const corsHeaders = {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json',
    };

    if (httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: ''
        };
    }

    if (httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    const { rollno, typeOfStudent } = queryStringParameters || {};

    if (!rollno || !typeOfStudent) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: "Missing rollno or typeOfStudent parameters" })
        };
    }

    const targetUrl = `https://results.ietdavv.edu.in/DisplayStudentResult?rollno=${encodeURIComponent(
        rollno
    )}&typeOfStudent=${encodeURIComponent(typeOfStudent)}`;

    return new Promise((resolve) => {
        https.get(targetUrl, (res) => {
            if (res.statusCode !== 200) {
                resolve({
                    statusCode: res.statusCode,
                    headers: corsHeaders,
                    body: JSON.stringify({ error: "Failed to fetch results from the portal" })
                });
                return;
            }

            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve({
                    statusCode: 200,
                    headers: corsHeaders,
                    body: JSON.stringify({ html: data })
                });
            });
        }).on('error', (err) => {
            console.error("Error fetching results:", err);
            resolve({
                statusCode: 500,
                headers: corsHeaders,
                body: JSON.stringify({ error: "Internal server error while fetching results" })
            });
        });
    });
};
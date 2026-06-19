exports.handler = async (event, context) => {
    const { httpMethod, queryStringParameters, headers } = event;

    const origin = headers.origin || headers.referer || '*';
    const corsHeaders = {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

    try {
        const targetUrl = `https://results.ietdavv.edu.in/DisplayStudentResult?rollno=${encodeURIComponent(
            rollno
        )}&typeOfStudent=${encodeURIComponent(typeOfStudent)}`;

        const response = await fetch(targetUrl);

        if (!response.ok) {
            return {
                statusCode: response.status,
                headers: corsHeaders,
                body: JSON.stringify({ error: "Failed to fetch results from the portal" })
            };
        }

        const html = await response.text();

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ html })
        };
    } catch (error) {
        console.error("Error fetching results:", error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: "Internal server error while fetching results" })
        };
    }
};
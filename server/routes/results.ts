import { RequestHandler } from "express";

export const getResults: RequestHandler = async (req, res) => {
    try {
        const { rollno, typeOfStudent } = req.query;

        if (!rollno || !typeOfStudent) {
            return res.status(400).json({ error: "Missing rollno or typeOfStudent parameters" });
        }

        // Proxy the request to the official results portal
        const targetUrl = `https://results.ietdavv.edu.in/DisplayStudentResult?rollno=${encodeURIComponent(
            rollno as string
        )}&typeOfStudent=${encodeURIComponent(typeOfStudent as string)}`;

        const response = await fetch(targetUrl);

        if (!response.ok) {
            return res.status(response.status).json({ error: "Failed to fetch results from the portal" });
        }

        const html = await response.text();

        // Return the raw HTML to the frontend for parsing
        res.json({ html });
    } catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).json({ error: "Internal server error while fetching results" });
    }
};

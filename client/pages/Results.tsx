import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, AlertCircle, User, BookOpen, Hash, Printer } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

interface SubjectResult {
    name: string;
    code: string;
    theory: string;
    practical: string;
}

interface StudentResult {
    enrollment: string;
    rollNo: string;
    name: string;
    subjects: SubjectResult[];
    sgpa?: string;
    cgpa?: string;
    overallResult?: string;
}

export default function Results() {
    const [rollNo, setRollNo] = useState("");
    const [studentType, setStudentType] = useState("Regular");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState<StudentResult | null>(null);

    const fetchResults = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rollNo.trim()) {
            setError("Please enter a valid roll number");
            return;
        }

        setIsLoading(true);
        setError("");
        setResult(null);

        try {
            const response = await fetch(`/.netlify/functions/api/get-student-marks?rollno=${encodeURIComponent(rollNo)}&typeOfStudent=${encodeURIComponent(studentType)}`);

            if (!response.ok) {
                throw new Error("Failed to fetch results. The server might be down or busy.");
            }

            const data = await response.json();

            if (!data.html) {
                throw new Error("Invalid response from proxy.");
            }

            parseResultHTML(data.html);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "An unexpected error occurred while fetching results.");
        } finally {
            setIsLoading(false);
        }
    };

    const parseResultHTML = (htmlStr: string) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlStr, "text/html");

        // Check if not found
        if (doc.body.textContent?.includes("ROLL NUMBER NOT FOUND")) {
            setError("Roll Number not found. Please check your input and try again.");
            return;
        }

        try {
            let enrollment = "";
            let studentName = "";
            let parsedRollNo = rollNo;
            const subjects: SubjectResult[] = [];
            let sgpa = "";
            let cgpa = "";
            let overallResult = "";

            const rows = doc.querySelectorAll("tr");

            rows.forEach(row => {
                const cells = row.querySelectorAll("td, th");
                const text = row.textContent || "";

                // 1. Student Details
                if (text.includes("Enrollment Number")) {
                    enrollment = cells[1]?.textContent?.trim() || "";
                }
                if (text.includes("Roll Number")) {
                    parsedRollNo = cells[1]?.textContent?.trim() || parsedRollNo;
                }
                if (text.includes("Student Name")) {
                    studentName = cells[1]?.textContent?.trim() || "";
                }

                // 2. SGPA / CGPA / Result
                if (cells.length === 2) {
                    const label = cells[0]?.textContent?.trim().toUpperCase() || "";
                    const value = cells[1]?.textContent?.trim() || "";
                    if (label === "SGPA") sgpa = value;
                    if (label === "CGPA") cgpa = value;
                    if (label === "RESULT") overallResult = value;
                }

                // 3. Subjects
                // Subject rows typically have 4 cells: Name, Code, Theory, Practical
                if (cells.length === 4) {
                    const name = cells[0]?.textContent?.trim() || "";
                    const code = cells[1]?.textContent?.trim() || "";
                    const theory = cells[2]?.textContent?.trim() || "";
                    const practical = cells[3]?.textContent?.trim() || "";

                    // Exclude the header row and ensure it looks like a valid row
                    if (name.toUpperCase() !== "SUBJECTS" && code.toUpperCase() !== "SUBJECT CODE") {
                        if (code.length >= 2) { // Subject codes are usually at least 2 chars
                            subjects.push({ name, code, theory, practical });
                        }
                    }
                }
            });

            if (!studentName && subjects.length === 0 && !sgpa) {
                setError("Could not parse the result format. The university portal might have changed its layout.");
                return;
            }

            setResult({
                enrollment,
                rollNo: parsedRollNo,
                name: studentName,
                subjects,
                sgpa,
                cgpa,
                overallResult
            });

        } catch (parseError) {
            console.error(parseError);
            setError("Error parsing the result data. Some fields might be missing.");
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col text-foreground relative">
            <Navigation />

            <main className="flex-1 relative z-10 px-4 md:px-16 pt-32 pb-32 max-w-[1600px] mx-auto w-full">
                <div className="max-w-5xl mx-auto space-y-8">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-4"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold font-syne tracking-tight">SEM Results</h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
                            Check your semester results instantly. Data is fetched directly from the official IET-DAVV results portal.
                        </p>
                    </motion.div>

                    {/* Search Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="border-primary/20 shadow-lg bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-6 md:p-8">
                                <form onSubmit={fetchResults} className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <Input
                                            placeholder="Enter Roll Number (e.g. 24B3001)"
                                            value={rollNo}
                                            onChange={(e) => setRollNo(e.target.value.toUpperCase())}
                                            className="pl-10 h-12 text-lg uppercase bg-background"
                                        />
                                    </div>
                                    <div className="w-full md:w-48">
                                        <Select value={studentType} onValueChange={setStudentType}>
                                            <SelectTrigger className="h-12 bg-background">
                                                <SelectValue placeholder="Student Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Regular">Regular</SelectItem>
                                                <SelectItem value="Ex">Ex</SelectItem>
                                                <SelectItem value="Elective1">Elective1</SelectItem>
                                                <SelectItem value="Elective2">Elective2</SelectItem>
                                                <SelectItem value="Elective3">Elective3</SelectItem>
                                                <SelectItem value="Internship">Internship</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button type="submit" disabled={isLoading} className="h-12 px-8 text-base">
                                        {isLoading ? "Fetching..." : "View Result"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Error Alert */}
                    {error && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                            <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        </motion.div>
                    )}

                    {/* Result Display */}
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="space-y-6"
                        >
                            {/* Student Info Card */}
                            <Card className="border-primary/10 bg-card overflow-hidden">
                                <div className="bg-primary/5 p-4 md:p-6 border-b border-primary/10">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-4">
                                                <h2 className="text-2xl font-bold font-syne text-foreground flex items-center gap-2">
                                                    <User className="w-6 h-6 text-primary" />
                                                    {result.name || "N/A"}
                                                </h2>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => window.print()}
                                                    className="ml-auto md:ml-4 hidden sm:flex gap-2 print:hidden"
                                                >
                                                    <Printer className="w-4 h-4" />
                                                    Print / Save PDF
                                                </Button>
                                            </div>
                                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Hash className="w-4 h-4" /> Roll No: <span className="font-semibold text-foreground">{result.rollNo}</span>
                                                </span>
                                                {result.enrollment && (
                                                    <span className="flex items-center gap-1">
                                                        <BookOpen className="w-4 h-4" /> Enrollment: <span className="font-semibold text-foreground">{result.enrollment}</span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {(result.sgpa || result.cgpa) && (
                                            <div className="flex gap-4">
                                                {result.sgpa && (
                                                    <div className="text-center px-4 py-2 bg-background rounded-lg border border-border">
                                                        <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">SGPA</div>
                                                        <div className="text-2xl font-black text-primary">{result.sgpa}</div>
                                                    </div>
                                                )}
                                                {result.cgpa && (
                                                    <div className="text-center px-4 py-2 bg-background rounded-lg border border-border">
                                                        <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">CGPA</div>
                                                        <div className="text-2xl font-black text-primary">{result.cgpa}</div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Subjects Table */}
                                <div className="p-0 overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-muted/50">
                                            <TableRow>
                                                <TableHead className="w-[40%] pl-6">Subject</TableHead>
                                                <TableHead>Code</TableHead>
                                                <TableHead className="text-center">Theory</TableHead>
                                                <TableHead className="text-center pr-6">Practical</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {result.subjects.length > 0 ? (
                                                result.subjects.map((sub, idx) => (
                                                    <TableRow key={idx} className="hover:bg-muted/30">
                                                        <TableCell className="font-medium pl-6">{sub.name}</TableCell>
                                                        <TableCell className="text-muted-foreground">{sub.code}</TableCell>
                                                        <TableCell className="text-center">
                                                            <Badge variant={['A+', 'A', 'B+', 'B', 'C+', 'C', 'P'].includes(sub.theory) ? 'default' : 'secondary'} className="w-12 justify-center">
                                                                {sub.theory || '-'}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-center pr-6">
                                                            <Badge variant={['A+', 'A', 'B+', 'B', 'C+', 'C', 'P'].includes(sub.practical) ? 'default' : 'secondary'} className="w-12 justify-center">
                                                                {sub.practical || '-'}
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                        No subjects found in the result.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                {result.overallResult && (
                                    <div className="p-4 bg-muted/20 border-t border-border flex justify-between items-center">
                                        <span className="font-semibold text-muted-foreground">Overall Result</span>
                                        <Badge variant={result.overallResult.toUpperCase() === 'PASS' ? 'default' : 'destructive'} className="text-sm px-4 py-1">
                                            {result.overallResult}
                                        </Badge>
                                    </div>
                                )}
                            </Card>

                            <p className="text-xs text-center text-muted-foreground mt-8 print:block">
                                Disclaimer: The results published here are fetched from the university portal for immediate information to the examinees. These cannot be treated as original mark sheets.
                            </p>
                        </motion.div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

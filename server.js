const express = require("express");
const fs = require("fs");
const profile = require("./profile/profile.json");
const jobs = require("./data/jobs.json");
const jobRoutes = require("./routes/jobs");
const app = express();

app.use(express.json());
app.use("/jobs", jobRoutes);

app.get("/", (req, res) => {
    res.send(`
Name: ${profile.name}
Email: ${profile.email}
Role: ${profile.role}
Location: ${profile.location}
Phone: ${profile.phone}
LinkedIn: ${profile.linkedin}
GitHub: ${profile.github}
`);
});

app.get("/profile", (req, res) => {
    res.json(profile);
});



app.get("/jobs/status/:status", (req, res) => {
    const status = req.params.status;

    const filteredJobs = jobs.filter(
        (job) => job.status.toLowerCase() === status.toLowerCase()
    );

    res.json(filteredJobs);
});

app.get("/jobs/:id", (req, res) => {
    const jobId = Number(req.params.id);
    const job = jobs.find((job) => job.id === jobId);

    if (!job) {
        return res.status(404).json({
            error: "Job not found"
        });
    }

    res.json(job);
});

app.post("/add-job", (req, res) => {
    const newJob = req.body;

    newJob.id = jobs.length + 1;

    jobs.push(newJob);

    fs.writeFileSync(
        "./data/jobs.json",
        JSON.stringify(jobs, null, 2)
    );

    res.json(jobs);
});
app.put("/jobs/:id", (req, res) => {
    const jobId = Number(req.params.id);

    const job = jobs.find((job) => job.id === jobId);

    if (!job) {
        return res.status(404).json({
            error: "Job not found"
        });
    }

    job.status = req.body.status;

    fs.writeFileSync(
        "./data/jobs.json",
        JSON.stringify(jobs, null, 2)
    );

    res.json(job);
});
app.delete("/jobs/:id", (req, res) => {
    const jobId = Number(req.params.id);

    const jobIndex = jobs.findIndex(
        (job) => job.id === jobId
    );

    if (jobIndex === -1) {
        return res.status(404).json({
            error: "Job not found"
        });
    }

    const deletedJob = jobs.splice(jobIndex, 1)[0];

    fs.writeFileSync(
        "./data/jobs.json",
        JSON.stringify(jobs, null, 2)
    );

    res.json({
        message: "Job deleted",
        job: deletedJob
    });
});
const server = app.listen(3000, () => {
    console.log("Server is running at http://localhost:3000");
});

server.on("error", (error) => {
    console.error("Server failed to start:", error);
});
const { Router } = require("express");
const router = Router();
const Database = require("better-sqlite3");
const db = new Database("freelance.db", { verbose: console.log });

/**
 * Handle get request, queries the database to get the projects that the freelancer
 * worked on
 * @param fid - freelancer id
 * @returns {object} - returns an array of projects that the freelancer worked
 * on
 */
router.get("/:fid", async (req, res) => {
  try {
    const { fid } = req.params;
    let queryResult = `
    SELECT p.ID, p.completionStatus, p.payStatus, p.startDate, p.deadline,
    b.Name AS businessName, b.Industry
    FROM project AS p, worked_on AS w, freelancer AS f, business AS b
    WHERE f.ID=w.FID AND w.PID=p.ID
    AND f.ID=?
    AND p.projectOwner = b.ID
    `
    let stmt = db.prepare(queryResult);
    const result = stmt.all(fid);

    return res.status(200).json({ results: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server Error" });
  }
});

/**
 * Handle get request, queries the database to get the freelancers who worked on
 * the project
 * @param pid - project ID
 */
router.get("/:pid/contributors", async (req, res) => {
  try {
    const { pid } = req.params;
    let queryResult = `
    SELECT f.FirstName || ' ' || f.LastName AS Name, f.Username, f.Email, f.PhoneNo, f.Location
    FROM project AS p, freelancer AS f, worked_on AS w
    WHERE w.PID = p.ID AND w.FID = f.ID 
    AND p.ID=?
    `
    let stmt = db.prepare(queryResult);
    const result = stmt.all(pid);
    return res.status(200).json({ results: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server Error" });
  }
});

module.exports = { projectsRouter: router };
const { Router } = require("express");
const router = Router();
const Database = require("better-sqlite3");
const db = new Database("freelance.db", { verbose: console.log });

/**
 * Handle get request, queries the database to get the profile details of the
 * provided user
 * @param role - from req.params
 * @param id - from req.params
 * @returns {object} - returns user details if user exists,
 * else returns a 400 response status
 */
router.get("/:role/:id", async (req, res) => {
  try {
    const { role } = req.params;
    const { id } = req.params;
    let queryResult;

    if (role === "freelancer") {
      queryResult = queryFreelancer(id);
    } else if (role === "business") {
      queryResult = queryHiringManager(id);
    } else {
      return res.status(404).json({ error: "incorrect role was provided" });
    }
    if (queryResult.length === 0) {
      return res
        .status(400)
        .json({ error: "User ID provided is not available" });
    }
    return res.status(200).json({ results: queryResult[0] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server Error" });
  }
});

/**
 * Handle get request, queries the database to get the projects owned by 
 * a business
 * @param HID - hiring manager ID
 */
router.get("/:HID", async (req, res) => {
  try {
    const { HID } = req.params;
    let sql = `
    SELECT p.ID, p.completionStatus, p.payStatus, p.startDate,
    p.deadline, h.ID AS manager, p.projectOwner
    FROM project AS p, hiring_manager AS h
    WHERE h.ID =?
    AND h.worksFor = p.projectOwner
    `
    const stmt = db.prepare(sql);
    const result = stmt.all(HID);
    
    return res.status(200).json({ results: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server Error" });
  }
});

/**
 * perform sql query to get the profile details of the freelancer
 * @param {string} id - id of freelancer
 * @returns {object} -returns result of sql query
 */
function queryFreelancer(id) {
  let sql = null; // for sql statements

  //sql query
  sql = `
    SELECT *
    FROM freelancer
    WHERE ID=?
  `;

  let stmt = db.prepare(sql);
  const result = stmt.all(id);
  return result;
}

/**
 * perform sql query to get the profile details of the hiring manager and
 * the company details, the hiring manager works for
 * @param {string} id - id of hiring manager
 * @returns {object} - return result of sql query
 */
function queryHiringManager(id) {
  let sql; // for sql statements

  //sql query
  sql = `
    SELECT 
    h.ID AS HID, b.ID AS BID, h.UserName, h.First_Name, h.LAST_NAME, worksFor, 
    b.ID AS BID, b.Name, b.Industry
    FROM hiring_manager AS h, business AS b
    WHERE h.ID=?
    AND h.worksFor=b.ID
  `;

  let stmt = db.prepare(sql);
  const result = stmt.all(id);
  return result;
}

module.exports = { profileRouter: router };

const { Router } = require("express");
const router = Router();
const Database = require("better-sqlite3");
const db = new Database("freelance.db", { verbose: console.log });

/**
 * Handle get request, to view the offers owned by a user
 * @param - role (either a freelancer, hiring manager)
 */
router.get("/:role/:id", async (req, res) => {
  try {
    const { role } = req.params;
    const { id } = req.params;

    if (role === "freelancer") {
      queryResult = queryFreelancer(id);
    } else if (role === "business") {
      queryResult = queryHiringManager(id);
    } else {
      return res.status(404).json({ error: "incorrect role was provided" });
    }
    return res.status(200).json({ results: queryResult });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server Error" });
  }
});

/**
 * get the offers owned by the freelancer
 * @param {string} id - freelancer id
 */
function queryFreelancer(id) {
  //sql query
  let sql = `
  SELECT o.Salary, o.FreelancerStatus, o.ClientStatus,
  h.First_Name || ' ' || h.Last_Name AS hName, b.Name AS businessName, b.Industry
  FROM offer AS o, freelancer AS f, hiring_manager AS h, business AS b
  WHERE o.FID = f.ID AND h.ID=o.HID AND h.worksFor = b.ID
  AND f.ID=?
  `
  let stmt = db.prepare(sql);
  const result = stmt.all(id);
  return result;
}


/**
 * get the offers owned by the hiring manager
 * @param {string} id - hiring manager id
 */
function queryHiringManager(id) {
  let sql; // for sql statements

  //sql query
  sql = `
  SELECT f.FirstName || ' ' || f.LastName AS name,
  o.ClientStatus AS clientstatus, o.FreelancerStatus AS freelancestatus, 
  o.Salary AS salary, f.PhoneNo, f.Email AS email
  FROM offer AS o, freelancer AS f
  WHERE HID=?
  AND o.FID = f.ID
  `;

  let stmt = db.prepare(sql);
  const result = stmt.all(id);
  return result;
}

module.exports = { offersRouter: router };

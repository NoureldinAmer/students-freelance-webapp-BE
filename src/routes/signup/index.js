const { Router } = require("express");
const router = Router();
const Database = require("better-sqlite3");
const db = new Database("freelance.db", { verbose: console.log });
const { uuid } = require("../../utils/GenerateID");

/**
 * Handle login post request, validate login credentials
 * @param username - from req.body
 * @param password - from req.body
 * @returns {object} - returns user if user exists, else returns a 400 response status
 */
router.post("/", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      username,
      password,
      role,
      phoneNumber,
      location,
      businessName,
      businessIndustry,
    } = req.body;

    //check that user and email dont exist
    let sql = `
      SELECT *
      FROM freelancer AS f, hiring_manager AS h
      WHERE f.Username=? OR f.Email=?
      OR h.Username=?
    `;
    let stmt = db.prepare(sql);
    let queryResult = stmt.all(username, email, username);

    if (queryResult.length !== 0) {
      return res
        .status(400)
        .json({ error: "username and/or password already exist" });
    }
    let ID;

    if (role === "freelance") {
      const freelanceInfo = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: username,
        password:password,
        phoneNumber: phoneNumber,
        location: location
      }
      ID = freelancerSignUp(freelanceInfo);
    } else {
      const businessInfo = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: password,
        businessName: businessName,
        businessIndustry: businessIndustry
      }
      ID = businessSignUp(businessInfo);
    }
    return res.status(200).json({ msg: "successfully added user to DB", userID: ID });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server Error" });
  }
});

/**
 * Insert freelancer into database
 * @param {object} freelanceInfo 
 * @returns freelancer ID
 */
function freelancerSignUp(freelanceInfo) {
  try {
    const {
      firstName,
      lastName,
      email,
      username,
      password,
      phoneNumber,
      location,
    } = freelanceInfo;

    const freelancerID = uuid();

    let sql = `
	  INSERT INTO freelancer
	  VALUES (?,?,?,?,?,?,?,?)
	  `;
    let stmt = db.prepare(sql);
    stmt.run(
      freelancerID,
      username,
      email,
      phoneNumber,
      password,
      location,
      firstName,
      lastName
    );
    return freelancerID;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

/**
 * Insert hiring manager and business into database
 * @param {object} freelanceInfo 
 * @returns hiring manager ID
 */
function businessSignUp(businessInfo) {
  try {
	const {
	    firstName,
	    lastName,
	    username,
	    password,
	    businessName,
	    businessIndustry,
	  } = businessInfo;
	  const businessID = uuid();
	  
	  let sql = `
	  INSERT INTO business
		VALUES (?,?,?)
	  `
	  let stmt = db.prepare(sql);
	  stmt.run(businessID, businessName, businessIndustry);
	
	  const hiringManagerID = uuid();
	  sql = `
	  INSERT INTO hiring_manager 
	  VALUES (?,?,?,?,?,?)
	  `
	  stmt = db.prepare(sql);
	  stmt.run(hiringManagerID, username, password, firstName, lastName, businessID);
	  return hiringManagerID;
} catch (error) {
	console.log(error);
  throw error;
}
}

module.exports = { signupRouter: router };

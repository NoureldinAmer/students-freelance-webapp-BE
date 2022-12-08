const sqlite3 = require("sqlite3").verbose();
let sql; // for sql statements

async function createTables() {
  const db = await new sqlite3.Database(
    "./freelance.db",
    sqlite3.OPEN_READWRITE,
    (err) => {
      if (err) console.log(err);
    }
  );

  sqlStatements.map((table)=> {
    db.run(table.sql, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`[SUCCESSFULLY CREATED TABLE] ${table.tableName}`);
      }
    })
  })

  db.close();
}

const sqlStatements = [
  {
    tableName: "business",
    sql: `
      CREATE TABLE IF NOT EXISTS business
      (
        ID VARCHAR(50) NOT NULL,
        Name VARCHAR(100) NOT NULL,
        Industry VARCHAR(100) NOT NULL,
        PRIMARY KEY (ID)
      );
    `,
  },
  {
    tableName: "freelancer",
    sql: `
    CREATE TABLE IF NOT EXISTS freelancer
    (
      ID VARCHAR(50) NOT NULL,
      Username VARCHAR(100) NOT NULL,
      YearsOfExperience INT,
      Email VARCHAR(100) NOT NULL,
      PhoneNo VARCHAR(100),
      Password VARCHAR(100) NOT NULL,
      Location VARCHAR(100),
      Rating INT NOT NULL,
      FirstName VARCHAR(100) NOT NULL,
      LastName VARCHAR(100) NOT NULL,
      PRIMARY KEY (ID),
      UNIQUE (Username),
      UNIQUE (Email),
      UNIQUE (PhoneNo)
    );
  `,
  },
  {
    tableName: "project",
    sql: `
      CREATE TABLE IF NOT EXISTS project
      (
        ID VARCHAR(50) NOT NULL,
        completionStatus VARCHAR(100) NOT NULL,
        payStatus VARCHAR(100) NOT NULL,
        startDate DATE NOT NULL,
        deadline DATE NOT NULL,
        projectOwner VARCHAR(50) NOT NULL,
        PRIMARY KEY (ID),
        FOREIGN KEY (projectOwner) REFERENCES business(ID)
      );
    `,
  },
  {
    tableName: "admin",
    sql: `
      CREATE TABLE IF NOT EXISTS admin
      (
        username VARCHAR(100) NOT NULL,
        ID VARCHAR(50) NOT NULL,
        password VARCHAR(100) NOT NULL,
        PRIMARY KEY (ID),
        UNIQUE (username)
      );
    `,
  },
  {
    tableName: "skills",
    sql: `
      CREATE TABLE IF NOT EXISTS skills
      (
        ID VARCHAR(50) NOT NULL,
        skillName VARCHAR(100) NOT NULL,
        PRIMARY KEY (ID)
      );
    `,
  },
  {
    tableName: "worked_on",
    sql: `
      CREATE TABLE IF NOT EXISTS worked_on
      (
        FID VARCHAR(50) NOT NULL,
        PID VARCHAR(50) NOT NULL,
        PRIMARY KEY (FID, PID),
        FOREIGN KEY (FID) REFERENCES freelancer(ID),
        FOREIGN KEY (PID) REFERENCES project(ID)
      );
    `,
  },
  {
    tableName: "has_skill",
    sql: `
      CREATE TABLE IF NOT EXISTS has_skill
      (
        SID VARCHAR(50) NOT NULL,
        FID VARCHAR(50) NOT NULL,
        proficiency VARCHAR(100),
        PRIMARY KEY (SID, FID),
        FOREIGN KEY (SID) REFERENCES skills(ID),
        FOREIGN KEY (FID) REFERENCES freelancer(ID)
      );
    `,
  },
  {
    tableName: "job_post",
    sql: `
      CREATE TABLE IF NOT EXISTS job_post
      (
        Duration INT NOT NULL,
        WorkingHours INT NOT NULL,
        Salary INT NOT NULL,
        Description VARCHAR(5000),
        JobName VARCHAR NOT NULL,
        ID VARCHAR(1000) NOT NULL,
        DatePosted DATE NOT NULL,
        Industry VARCHAR(500),
        JobPostOwner VARCHAR(50) NOT NULL,
        PRIMARY KEY (ID),
        FOREIGN KEY (JobPostOwner) REFERENCES business(ID)
      );
    `,
  },
  {
    tableName: "hiring_manager",
    sql: `
      CREATE TABLE IF NOT EXISTS hiring_manager
      (
        ID VARCHAR(50) NOT NULL,
        UserName VARCHAR(1000) NOT NULL,
        Password VARCHAR NOT NULL,
        First_Name VARCHAR NOT NULL,
        Last_Name VARCHAR NOT NULL,
        worksFor VARCHAR(50) NOT NULL,
        PRIMARY KEY (ID),
        FOREIGN KEY (worksFor) REFERENCES business(ID),
        UNIQUE (UserName)
      );
    `,
  },
  {
    tableName: "application",
    sql: `
      CREATE TABLE IF NOT EXISTS application
      (
        YearsOfExperience VARCHAR(1000),
        ApplicantURL VARCHAR(10000),
        FID VARCHAR(50) NOT NULL,
        JID VARCHAR(1000) NOT NULL,
        PRIMARY KEY (FID, JID),
        FOREIGN KEY (FID) REFERENCES freelancer(ID),
        FOREIGN KEY (JID) REFERENCES job_post(ID)
      );
      `,
  },
  {
    tableName: "offer",
    sql: `
      CREATE TABLE IF NOT EXISTS offer
      (
        ClientStatus VARCHAR(100) NOT NULL,
        FreelancerStatus VARCHAR(100) NOT NULL,
        Salary VARCHAR(15) NOT NULL,
        FID VARCHAR(50) NOT NULL,
        HID VARCHAR(1000) NOT NULL,
        PRIMARY KEY (FID, HID),
        FOREIGN KEY (FID) REFERENCES freelancer(ID),
        FOREIGN KEY (HID) REFERENCES hiring_manager(ID)
      );
      `,
  },
  {
    tableName: "requires",
    sql: `
      CREATE TABLE IF NOT EXISTS requires
      (
        SID VARCHAR(50) NOT NULL,
        JID VARCHAR(1000) NOT NULL,
        PRIMARY KEY (SID, JID),
        FOREIGN KEY (SID) REFERENCES skills(ID),
        FOREIGN KEY (JID) REFERENCES job_post(ID)
      );
      `,
  },
  {
    tableName: "hire",
    sql: `
      CREATE TABLE IF NOT EXISTS hire
      (
        HID VARCHAR(1000) NOT NULL,
        JID VARCHAR(1000) NOT NULL,
        PRIMARY KEY (HID, JID),
        FOREIGN KEY (HID) REFERENCES hiring_manager(ID),
        FOREIGN KEY (JID) REFERENCES job_post(ID)
      );
      `,
  },
  {
    tableName: "approves",
    sql: `
      CREATE TABLE IF NOT EXISTS approves
      (
        JID VARCHAR(1000) NOT NULL,
        AID VARCHAR(50) NOT NULL,
        PRIMARY KEY (JID, AID),
        FOREIGN KEY (JID) REFERENCES job_post(ID),
        FOREIGN KEY (AID) REFERENCES admin(ID)
      );
    `,
  },
  {
    tableName: "job_post_locations",
    sql: `
      CREATE TABLE IF NOT EXISTS job_post_locations
      (
        JLocation VARCHAR(100) NOT NULL,
        JID VARCHAR(1000) NOT NULL,
        PRIMARY KEY (JLocation, JID),
        FOREIGN KEY (JID) REFERENCES job_post(ID)
      );
    `,
  },
];

module.exports = { createTables };

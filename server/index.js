import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pg from "pg";

dotenv.config();
const app = express();

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
db.connect();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
let biases = [];

app.post("/login", async (req, res) => {
  const { user_name, password } = req.body;
  try {
    const result = await db.query(
      "SELECT * FROM users WHERE user_name = $1 AND password = $2",
      [user_name, password]
    );
    if (result.rows.length > 0) {
      res.json({ success: true, users: result.rows[0] });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/register", async (req, res) => {
  const { user_name, password } = req.body;

  if (!user_name || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields required" });
  }

  try {
    const userExists = await db.query(
      "SELECT * FROM users WHERE user_name = $1",
      [user_name]
    );

    if (userExists.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "User name already exists, try another name",
      });
    }

    await db.query("INSERT INTO users (user_name, password) VALUES ($1, $2)", [
      user_name,
      password,
    ]);
    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/api/biases", async (req, res) => {
  const {
    biasType,
    biasSource,
    description,
    severity,
    affectedGroups,
    submittedBy,
    mitigationStrategies,
  } = req.body;

  try {
    console.log("Incoming data:", req.body);

    // Check for duplicate in main `biases` table
    const checkDuplicate = await db.query(
      `SELECT * FROM biases WHERE bias_type = $1 AND bias_source = $2 AND bias_description = $3`,
      [biasType, biasSource, description]
    );
    if (checkDuplicate.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Bias already exists!",
      });
    }

    await db.query(
      `INSERT INTO pending_bias_requests 
         (bias_type, bias_source, bias_description, severity_score, affected_groups, submitted_by, m_strategy_description)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        biasType,
        biasSource,
        description,
        severity,
        affectedGroups,
        submittedBy,
        mitigationStrategies,
      ]
    );

    res
      .status(201)
      .json({ success: true, message: "Bias submitted for review" });
  } catch (err) {
    console.error("🔥 Submission error:", err);
    res.status(500).json({
      success: false,
      message: "Submission failed",
      error: err.message,
    });
  }
});

app.get("/api/biases", async (req, res) => {
  const { search = "", severity = "", type = "" } = req.query;

  try {
    const result = await db.query(
      `
        SELECT 
          b.bias_id,
          b.bias_type,
          b.bias_source,
          b.bias_description,
          b.severity_score,
          b.affected_groups,
          u.user_name AS submitted_by,
          ms.m_strategy_description
        FROM biases b
        LEFT JOIN users u ON b.submitted_by = u.user_id
        LEFT JOIN mitigation_strategies ms ON b.bias_id = ms.bias_id  -- 🔥 ensure correct join
        WHERE 
          (LOWER(b.bias_type) LIKE LOWER($1) OR
           LOWER(b.bias_source) LIKE LOWER($1) OR
           LOWER(b.bias_description) LIKE LOWER($1) OR
           LOWER(b.affected_groups) LIKE LOWER($1) OR
           LOWER(u.user_name) LIKE LOWER($1))
          AND ($2 = '' OR LOWER(b.severity_score) = LOWER($2))
          AND ($3 = '' OR LOWER(b.bias_type) = LOWER($3))
        ORDER BY b.bias_id DESC
      `,
      [`%${search}%`, severity, type]
    );

    res.json({ success: true, biases: result.rows });
  } catch (err) {
    console.error("Error in /api/biases:", err);
    res.status(500).json({ success: false, message: "Failed to fetch biases" });
  }
});

app.get("/admin/pending-biases", async (req, res) => {
  try {
    const result = await db.query(`
        SELECT 
          pb.bias_request_id,
          pb.bias_type,
          pb.bias_source,
          pb.bias_description,
          pb.severity_score,
          pb.affected_groups,
          pb.m_strategy_description,
          u.user_name AS submitted_by
        FROM pending_bias_requests pb
        LEFT JOIN users u ON pb.submitted_by = u.user_id
      `);

    res.json({ success: true, biases: result.rows });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Could not fetch pending biases" });
  }
});

// Approve bias
app.post("/admin/approve-bias", async (req, res) => {
  const { id } = req.body;
  try {
    // Get pending bias
    const result = await db.query(
      "SELECT * FROM pending_bias_requests WHERE bias_request_id = $1",
      [id]
    );
    const bias = result.rows[0];

    if (!bias) {
      return res
        .status(404)
        .json({ success: false, message: "Bias not found" });
    }

    // Insert into biases
    const insertBiasRes = await db.query(
      `INSERT INTO biases 
          (bias_type, bias_source, bias_description, severity_score, affected_groups, submitted_by)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING bias_id`,
      [
        bias.bias_type,
        bias.bias_source,
        bias.bias_description,
        bias.severity_score,
        bias.affected_groups,
        bias.submitted_by,
      ]
    );

    const newBiasId = insertBiasRes.rows[0].bias_id;

    // Insert into mitigation_strategies
    const strategyRes = await db.query(
      `INSERT INTO mitigation_strategies (bias_id, m_strategy_description)
         VALUES ($1, $2)
         RETURNING mitigation_strategy_id`,
      [newBiasId, bias.m_strategy_description]
    );

    const newStrategyId = strategyRes.rows[0].mitigation_strategy_id;

    // Update biases table with m_strategy_id
    await db.query(
      `UPDATE biases 
         SET m_strategy_id = $1
         WHERE bias_id = $2`,
      [newStrategyId, newBiasId]
    );

    // Delete from pending
    await db.query(
      "DELETE FROM pending_bias_requests WHERE bias_request_id = $1",
      [id]
    );

    res.json({
      success: true,
      message: "Bias approved and linked to mitigation strategy",
    });
  } catch (err) {
    console.error("Error in /admin/approve-bias:", err);
    res.status(500).json({ success: false, message: "Approval failed" });
  }
});

// Decline bias
app.post("/admin/decline-bias", async (req, res) => {
  const { id } = req.body;
  console.log("Received decline request for ID:", id);

  try {
    await db.query(
      "DELETE FROM pending_bias_requests WHERE bias_request_id = $1",
      [id]
    );
    res.json({ success: true, message: "Bias declined" });
  } catch (err) {
    console.error("Error in /admin/decline-bias:", err);
    res.status(500).json({ success: false, message: "Decline failed" });
  }
});

app.get("/api/bias-types", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT DISTINCT bias_type FROM biases ORDER BY bias_type ASC"
    );
    const types = result.rows.map((row) => row.bias_type);
    res.json({ success: true, types });
  } catch (err) {
    console.error("Error fetching bias types:", err);
    res.status(500).json({ success: false, message: "Failed to fetch types" });
  }
});

app.post("/api/biases/admin", async (req, res) => {
  const {
    biasType,
    biasSource,
    description,
    severity,
    affectedGroups,
    submittedBy, // this is username
    mitigationStrategies,
  } = req.body;

  try {
    // Lookup user_id from username
    const userResult = await db.query(
      "SELECT user_id FROM users WHERE user_name = $1",
      [submittedBy]
    );
    if (userResult.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const userId = userResult.rows[0].user_id;

    // Check for duplicates
    const duplicateCheck = await db.query(
      `SELECT * FROM biases WHERE bias_type = $1 AND bias_source = $2 AND bias_description = $3`,
      [biasType, biasSource, description]
    );
    if (duplicateCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Bias already exists!",
      });
    }

    // Continue with normal insert
    const biasInsertRes = await db.query(
      `INSERT INTO biases (bias_type, bias_source, bias_description, severity_score, affected_groups, submitted_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING bias_id`,
      [biasType, biasSource, description, severity, affectedGroups, userId]
    );
    const newBiasId = biasInsertRes.rows[0].bias_id;

    const strategyInsertRes = await db.query(
      `INSERT INTO mitigation_strategies (bias_id, m_strategy_description)
       VALUES ($1, $2)
       RETURNING mitigation_strategy_id`,
      [newBiasId, mitigationStrategies]
    );
    const newStrategyId = strategyInsertRes.rows[0].mitigation_strategy_id;

    await db.query(`UPDATE biases SET m_strategy_id = $1 WHERE bias_id = $2`, [
      newStrategyId,
      newBiasId,
    ]);

    res.status(201).json({
      success: true,
      message: "Bias submitted successfully",
    });
  } catch (err) {
    console.error("Error in /api/biases/admin:", err);
    res.status(500).json({
      success: false,
      message: "Admin submission failed",
    });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        u.user_id, 
        u.user_name, 
        COUNT(b.bias_id) AS submission_count
      FROM users u
      LEFT JOIN biases b ON u.user_id = b.submitted_by
      WHERE LOWER(u.user_name) != 'admin'
      GROUP BY u.user_id
      ORDER BY u.user_id ASC
    `);
    res.json({ success: true, users: result.rows });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
});

app.put("/admin/biases/:id", async (req, res) => {
  const { id } = req.params;
  const {
    bias_type,
    bias_source,
    bias_description,
    severity_score,
    affected_groups,
    m_strategy_description,
  } = req.body;

  try {
    // Update main bias fields
    await db.query(
      `UPDATE biases SET 
        bias_type = $1,
        bias_source = $2,
        bias_description = $3,
        severity_score = $4,
        affected_groups = $5
      WHERE bias_id = $6`,
      [
        bias_type,
        bias_source,
        bias_description,
        severity_score,
        affected_groups,
        id,
      ]
    );

    // Update mitigation strategy
    const strategyCheck = await db.query(
      `SELECT mitigation_strategy_id FROM mitigation_strategies WHERE bias_id = $1`,
      [id]
    );

    if (strategyCheck.rows.length > 0) {
      // Strategy exists → update
      await db.query(
        `UPDATE mitigation_strategies 
         SET m_strategy_description = $1 
         WHERE bias_id = $2`,
        [m_strategy_description, id]
      );
    } else {
      // Strategy does not exist → insert new one
      const strategyRes = await db.query(
        `INSERT INTO mitigation_strategies (bias_id, m_strategy_description)
         VALUES ($1, $2) RETURNING mitigation_strategy_id`,
        [id, m_strategy_description]
      );

      const newStrategyId = strategyRes.rows[0].mitigation_strategy_id;

      // Update m_strategy_id in biases table
      await db.query(
        `UPDATE biases SET m_strategy_id = $1 WHERE bias_id = $2`,
        [newStrategyId, id]
      );
    }

    res.json({ success: true, message: "Bias updated successfully." });
  } catch (err) {
    console.error("Error in /admin/biases/:id:", err);
    res.status(500).json({ success: false, message: "Failed to update bias." });
  }
});

// DELETE bias by ID (Admin only)
app.delete("/admin/biases/:id", async (req, res) => {
  const biasId = req.params.id;

  try {
    // First delete the mitigation strategy (to satisfy FK constraints)
    await db.query("DELETE FROM mitigation_strategies WHERE bias_id = $1", [
      biasId,
    ]);

    // Then delete the bias
    await db.query("DELETE FROM biases WHERE bias_id = $1", [biasId]);

    res.json({ success: true, message: "Bias deleted successfully." });
  } catch (err) {
    console.error("Error deleting bias:", err);
    res.status(500).json({ success: false, message: "Deletion failed." });
  }
});

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});

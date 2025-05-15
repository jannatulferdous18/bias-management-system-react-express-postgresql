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
    type, // 'Dataset' or 'Algorithm'
    name,
    domain,
    description,
    biasType,
    biasIdentification,
    severity,
    mitigationStrategies,
    submittedBy,
    version,
    publishedDate,
    size,
    format,
    biasVersionRange,
    technique,
    key_characteristic,
    reference,
  } = req.body;

  // Convert to snake_case for DB
  const bias_type = biasType;
  const bias_identification = biasIdentification || null;
  const mitigation_strategies = mitigationStrategies;
  const submitted_by = submittedBy;
  const dataset_algorithm_version = version;
  const published_date = publishedDate || null;
  const bias_version_range = biasVersionRange || null;

  try {
    console.log("Incoming data:", req.body);

    // Check for duplicates
    const checkDuplicate = await db.query(
      `SELECT * FROM biases 
       WHERE type = $1 AND name = $2 AND description = $3 AND bias_type = $4`,
      [type, name, description, bias_type]
    );

    if (checkDuplicate.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Bias already exists!",
      });
    }

    // Insert new bias
    await db.query(
      `INSERT INTO pending_request (
        type, name, domain, description, bias_type, severity, mitigation_strategies,
        submitted_by, dataset_algorithm_version, published_date, size, format, bias_version_range,
        technique, bias_identification, key_characteristic, reference
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13,
        $14, $15, $16, $17
      )`,
      [
        type,
        name,
        domain,
        description,
        bias_type,
        severity,
        mitigation_strategies,
        submitted_by,
        dataset_algorithm_version,
        published_date,
        size,
        format,
        bias_version_range,
        technique,
        bias_identification,
        key_characteristic,
        reference,
      ]
    );

    res
      .status(201)
      .json({ success: true, message: "Bias submitted successfully" });
  } catch (err) {
    console.error("Submission error:", err);
    res.status(500).json({
      success: false,
      message: "Submission failed",
      error: err.message,
    });
  }
});

app.get("/api/biases", async (req, res) => {
  const {
    search = "",
    severity = "",
    biasType = "",
    componentType = "",
  } = req.query;

  try {
    const result = await db.query(
      `
        SELECT 
          b.bias_id,
          b.type,
          b.name,
          b.domain,
          b.description,
          b.bias_type,
          b.severity,
          ms.strategy_description AS mitigation_strategy, 
          u.user_name AS submitted_by,
          b.dataset_algorithm_version,
          b.published_date,
          b.size,
          b.format,
          b.bias_version_range,
          b.technique,
          b.bias_identification,
          b.key_characteristic,
          b.reference,
          b.created_at
        FROM biases b
        LEFT JOIN users u ON b.submitted_by = u.user_id
        LEFT JOIN mitigation_strategy ms ON b.mitigation_id = ms.mitigation_id
        WHERE 
          (LOWER(b.name) LIKE LOWER($1) OR
           LOWER(b.domain) LIKE LOWER($1) OR
           LOWER(b.description) LIKE LOWER($1) OR
           LOWER(b.bias_type) LIKE LOWER($1) OR
           LOWER(u.user_name) LIKE LOWER($1))
          AND ($2 = '' OR LOWER(b.severity) = LOWER($2))
          AND ($3 = '' OR LOWER(b.bias_type) = LOWER($3))
          AND ($4 = '' OR LOWER(b.type) = LOWER($4))
        ORDER BY b.bias_id DESC
      `,
      [`%${search}%`, severity, biasType, componentType]
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
        pr.request_id,
        pr.bias_type,
        pr.severity,
        pr.type,
        pr.domain
      FROM pending_request pr
      LEFT JOIN users u ON pr.submitted_by = u.user_id
    `);

    res.json({ success: true, biases: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Could not fetch pending biases",
    });
  }
});

// Approve bias
app.post("/admin/approve-bias", async (req, res) => {
  const { id } = req.body;

  try {
    const { rows } = await db.query(
      `SELECT * FROM pending_request WHERE request_id = $1`,
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    const bias = rows[0];

    const {
      type,
      name,
      domain,
      description,
      bias_type,
      severity,
      submitted_by,
      dataset_algorithm_version,
      published_date,
      size,
      format,
      key_characteristic,
      reference,
      bias_version_range,
      technique,
      bias_identification,
      mitigation_strategies,
    } = bias;

    // STEP 1: Insert the bias (without mitigation_id yet)
    const biasInsertRes = await db.query(
      `INSERT INTO biases (
        type, name, domain, description, bias_type, severity,
        submitted_by, dataset_algorithm_version, published_date, size, format,
        bias_version_range, technique, bias_identification, key_characteristic, reference
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11,
        $12, $13, $14, $15, $16
      ) RETURNING bias_id`,
      [
        type,
        name,
        domain,
        description,
        bias_type,
        severity,
        submitted_by,
        dataset_algorithm_version,
        published_date,
        size,
        format,
        bias_version_range,
        technique,
        bias_identification,
        key_characteristic,
        reference,
      ]
    );

    const bias_id = biasInsertRes.rows[0].bias_id;

    // STEP 2: Insert mitigation strategy with the newly obtained bias_id
    const mitigationRes = await db.query(
      `INSERT INTO mitigation_strategy (bias_id, strategy_description)
       VALUES ($1, $2) RETURNING mitigation_id`,
      [bias_id, mitigation_strategies]
    );

    const mitigation_id = mitigationRes.rows[0].mitigation_id;

    // STEP 3: Update bias with the mitigation_id
    await db.query(`UPDATE biases SET mitigation_id = $1 WHERE bias_id = $2`, [
      mitigation_id,
      bias_id,
    ]);

    // STEP 4: Clean up pending request
    await db.query(`DELETE FROM pending_request WHERE request_id = $1`, [id]);

    res.json({ success: true, message: "Bias approved and added." });
  } catch (err) {
    console.error("Error approving bias:", err);
    res.status(500).json({ success: false, message: "Error approving bias." });
  }
});

// Decline bias
app.post("/admin/decline-bias", async (req, res) => {
  const { id } = req.body;

  try {
    await db.query(`DELETE FROM pending_request WHERE request_id = $1`, [id]);
    res.json({ success: true, message: "Bias request declined and removed." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error declining bias." });
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
    type,
    name,
    domain,
    description,
    biasType,
    biasIdentification,
    severity,
    mitigationStrategies,
    submittedBy, // now should be user_id
    version,
    publishedDate,
    size,
    format,
    biasVersionRange,
    technique,
    key_characteristic,
    reference,
  } = req.body;

  const bias_type = biasType;
  const bias_identification = biasIdentification || null;
  const dataset_algorithm_version = version;
  const published_date = publishedDate || null;
  const bias_version_range = biasVersionRange || null;

  try {
    // Confirm user exists (optional if frontend is trusted)
    const userResult = await db.query(
      "SELECT user_id FROM users WHERE user_id = $1",
      [submittedBy]
    );
    if (userResult.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check for duplicate
    const checkDuplicate = await db.query(
      `SELECT * FROM biases 
       WHERE type = $1 AND name = $2 AND description = $3 AND bias_type = $4`,
      [type, name, description, bias_type]
    );

    if (checkDuplicate.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Bias already exists!",
      });
    }

    // Insert bias
    const biasInsertRes = await db.query(
      `INSERT INTO biases (
        type, name, domain, description, bias_type, severity,
        submitted_by, dataset_algorithm_version, published_date, size, format,
        bias_version_range, technique, bias_identification, key_characteristic, reference
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11,
        $12, $13, $14, $15, $16
      ) RETURNING bias_id`,
      [
        type,
        name,
        domain,
        description,
        bias_type,
        severity,
        submittedBy,
        dataset_algorithm_version,
        published_date,
        size,
        format,
        bias_version_range,
        technique,
        bias_identification,
        key_characteristic,
        reference,
      ]
    );

    const newBiasId = biasInsertRes.rows[0].bias_id;

    // Insert into mitigation_strategy table
    const strategyInsertRes = await db.query(
      `INSERT INTO mitigation_strategy (bias_id, strategy_description)
       VALUES ($1, $2)
       RETURNING mitigation_id`,
      [newBiasId, mitigationStrategies]
    );

    const newStrategyId = strategyInsertRes.rows[0].mitigation_id;

    // Update biases table to store FK reference
    await db.query(`UPDATE biases SET mitigation_id = $1 WHERE bias_id = $2`, [
      newStrategyId,
      newBiasId,
    ]);

    res.status(201).json({
      success: true,
      message: "Bias submitted successfully",
    });
  } catch (err) {
    console.error("Error in /api/biases/admin:", err.stack || err.message);
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
    type,
    name,
    domain,
    description,
    bias_type,
    severity,
    mitigation_strategy,
    dataset_algorithm_version,
    published_date,
    size,
    format,
    key_characteristic,
    reference,
    bias_version_range,
    technique,
    bias_identification,
  } = req.body;

  try {
    // Update bias information
    await db.query(
      `UPDATE biases SET 
        type = $1,
        name = $2,
        domain = $3,
        description = $4,
        bias_type = $5,
        severity = $6,
        dataset_algorithm_version = $7,
        published_date = $8,
        size = $9,
        format = $10,
        bias_version_range = $11,
        technique = $12,
        bias_identification = $13,
        key_characteristic = $14,
        reference = $15
      WHERE bias_id = $16`,
      [
        type,
        name,
        domain,
        description,
        bias_type,
        severity,
        dataset_algorithm_version,
        published_date,
        size,
        format,
        bias_version_range,
        technique,
        bias_identification,
        key_characteristic,
        reference,
        id,
      ]
    );

    // Update mitigation strategy
    const strategyCheck = await db.query(
      `SELECT mitigation_id FROM mitigation_strategy WHERE bias_id = $1`,
      [id]
    );

    if (strategyCheck.rows.length > 0) {
      // Strategy exists — update
      await db.query(
        `UPDATE mitigation_strategy 
         SET strategy_description = $1 
         WHERE bias_id = $2`,
        [mitigation_strategy, id]
      );
    } else {
      // Strategy doesn't exist — insert new
      const strategyRes = await db.query(
        `INSERT INTO mitigation_strategy (bias_id, strategy_description)
         VALUES ($1, $2) RETURNING mitigation_id`,
        [id, mitigation_strategy]
      );

      const newMitigationId = strategyRes.rows[0].mitigation_id;

      // Link to biases table
      await db.query(
        `UPDATE biases SET mitigation_id = $1 WHERE bias_id = $2`,
        [newMitigationId, id]
      );
    }

    res.json({ success: true, message: "Bias updated successfully." });
  } catch (err) {
    console.error("Error in PUT /admin/biases/:id:", err.stack || err.message);
    res.status(500).json({ success: false, message: "Failed to update bias." });
  }
});

// DELETE bias by ID (Admin only)
app.delete("/admin/biases/:id", async (req, res) => {
  const biasId = req.params.id;

  try {
    // Step 1: Get mitigation_id from the bias
    const biasResult = await db.query(
      "SELECT mitigation_id FROM biases WHERE bias_id = $1",
      [biasId]
    );

    if (biasResult.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Bias not found" });
    }

    const mitigationId = biasResult.rows[0].mitigation_id;

    // Step 2: Delete mitigation strategy if exists
    if (mitigationId) {
      await db.query(
        "DELETE FROM mitigation_strategy WHERE mitigation_id = $1",
        [mitigationId]
      );
    }

    // Step 3: Delete the bias
    await db.query("DELETE FROM biases WHERE bias_id = $1", [biasId]);

    res.json({
      success: true,
      message: "Bias and mitigation strategy deleted.",
    });
  } catch (err) {
    console.error("Error deleting bias:", err);
    res.status(500).json({ success: false, message: "Deletion failed." });
  }
});

// show specific bias
app.get("/api/biases/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `
      SELECT 
        b.bias_id,
        b.type,
        b.name,
        b.domain,
        b.description,
        b.bias_type,
        b.severity,
        ms.strategy_description AS mitigation_strategies,
        b.submitted_by,
        u.user_name AS submitted_by_name,
        b.dataset_algorithm_version,
        b.published_date,
        b.size,
        b.format,
        b.key_characteristic,
        b.bias_version_range,
        b.technique,
        b.bias_identification,
        b.reference,
        b.created_at,
        COALESCE(SUM(bo.occurrence_count), 0) AS occurrence_count
      FROM biases b
      LEFT JOIN users u ON b.submitted_by = u.user_id
      LEFT JOIN mitigation_strategy ms ON b.mitigation_id = ms.mitigation_id
      LEFT JOIN bias_occurrences bo ON b.bias_id = bo.bias_id
      WHERE b.bias_id = $1
      GROUP BY 
    b.bias_id, u.user_name, ms.strategy_description
      `,
      [id]
    );

    if (result.rows.length > 0) {
      res.json({ success: true, bias: result.rows[0] });
    } else {
      res.status(404).json({ success: false, message: "Bias not found" });
    }
  } catch (err) {
    console.error("Error fetching bias by ID:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});

app.get("/admin/pending-bias/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `
      SELECT 
        pr.request_id,
        pr.bias_type,
        pr.type,
        pr.domain,
        pr.dataset_algorithm_version,
        pr.published_date,
        pr.size,
        pr.format,
        pr.key_characteristic,
        pr.bias_version_range,
        pr.name,
        pr.description,
        pr.severity,
        pr.technique,
        pr.bias_identification,
        pr.mitigation_strategies,
        pr.reference,
        pr.created_at,
        u.user_name AS submitted_by
      FROM pending_request pr
      LEFT JOIN users u ON pr.submitted_by = u.user_id
      WHERE pr.request_id = $1
      `,
      [id]
    );

    if (result.rows.length > 0) {
      res.json({ success: true, bias: result.rows[0] });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Pending Bias not found" });
    }
  } catch (err) {
    console.error("Error fetching pending bias by ID:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

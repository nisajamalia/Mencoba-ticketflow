// Vercel serverless function for tickets API
import { getConnection, handleCors } from "../lib/db.js";

export default async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) return;

  const connection = await getConnection();

  try {
    switch (req.method) {
      case "GET":
        return await handleGet(req, res, connection);
      case "POST":
        return await handlePost(req, res, connection);
      case "PUT":
        return await handlePut(req, res, connection);
      case "DELETE":
        return await handleDelete(req, res, connection);
      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        res.status(405).json({ success: false, message: "Method not allowed" });
    }
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

async function handleGet(req, res, connection) {
  const {
    id,
    page = 1,
    limit = 15,
    search,
    status,
    priority,
    category,
    archived,
  } = req.query;

  try {
    if (id) {
      // Get single ticket
      const [rows] = await connection.execute(
        `
        SELECT t.*, c.name as category_name, u.name as created_by_name, 
               assigned_user.name as assigned_to_name
        FROM tickets t
        LEFT JOIN categories c ON t.category_id = c.id
        LEFT JOIN users u ON t.created_by = u.id
        LEFT JOIN users assigned_user ON t.assigned_to = assigned_user.id
        WHERE t.id = ?
      `,
        [id]
      );

      if (rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Ticket not found" });
      }

      return res.json({ success: true, data: rows[0] });
    }

    // Build dynamic WHERE clause
    let whereConditions = ["1=1"];
    let queryParams = [];

    if (search) {
      whereConditions.push("(t.title LIKE ? OR t.description LIKE ?)");
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    if (status) {
      whereConditions.push("t.status = ?");
      queryParams.push(status);
    }

    if (priority) {
      whereConditions.push("t.priority = ?");
      queryParams.push(priority);
    }

    if (category) {
      whereConditions.push("t.category_id = ?");
      queryParams.push(category);
    }

    if (archived !== undefined) {
      whereConditions.push("t.archived = ?");
      queryParams.push(archived === "true" ? 1 : 0);
    }

    const whereClause = whereConditions.join(" AND ");

    // Get total count
    const [countResult] = await connection.execute(
      `
      SELECT COUNT(*) as total 
      FROM tickets t 
      LEFT JOIN categories c ON t.category_id = c.id 
      WHERE ${whereClause}
    `,
      queryParams
    );

    const total = countResult[0].total;
    const offset = (page - 1) * limit;

    // Get tickets
    const [rows] = await connection.execute(
      `
      SELECT t.*, c.name as category_name, u.name as created_by_name,
             assigned_user.name as assigned_to_name
      FROM tickets t
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN users u ON t.created_by = u.id
      LEFT JOIN users assigned_user ON t.assigned_to = assigned_user.id
      WHERE ${whereClause}
      ORDER BY t.created_at DESC
      LIMIT ? OFFSET ?
    `,
      [...queryParams, parseInt(limit), parseInt(offset)]
    );

    return res.json({
      success: true,
      data: rows,
      pagination: {
        current_page: parseInt(page),
        per_page: parseInt(limit),
        total,
        last_page: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET tickets error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch tickets" });
  }
}

async function handlePost(req, res, connection) {
  const {
    title,
    description,
    priority = "medium",
    category_id,
    assigned_to,
  } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ success: false, message: "Title and description are required" });
  }

  try {
    const [result] = await connection.execute(
      `
      INSERT INTO tickets (title, description, status, priority, category_id, assigned_to, created_by, created_at, updated_at)
      VALUES (?, ?, 'open', ?, ?, ?, 1, NOW(), NOW())
    `,
      [title, description, priority, category_id || null, assigned_to || null]
    );

    // Fetch the created ticket
    const [rows] = await connection.execute(
      `
      SELECT t.*, c.name as category_name, u.name as created_by_name,
             assigned_user.name as assigned_to_name
      FROM tickets t
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN users u ON t.created_by = u.id
      LEFT JOIN users assigned_user ON t.assigned_to = assigned_user.id
      WHERE t.id = ?
    `,
      [result.insertId]
    );

    return res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("POST tickets error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create ticket" });
  }
}

async function handlePut(req, res, connection) {
  const { id } = req.query;
  const {
    title,
    description,
    status,
    priority,
    category_id,
    assigned_to,
    archived,
  } = req.body;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Ticket ID is required" });
  }

  try {
    // Build dynamic SET clause
    let setFields = [];
    let queryParams = [];

    if (title !== undefined) {
      setFields.push("title = ?");
      queryParams.push(title);
    }
    if (description !== undefined) {
      setFields.push("description = ?");
      queryParams.push(description);
    }
    if (status !== undefined) {
      setFields.push("status = ?");
      queryParams.push(status);
    }
    if (priority !== undefined) {
      setFields.push("priority = ?");
      queryParams.push(priority);
    }
    if (category_id !== undefined) {
      setFields.push("category_id = ?");
      queryParams.push(category_id);
    }
    if (assigned_to !== undefined) {
      setFields.push("assigned_to = ?");
      queryParams.push(assigned_to);
    }
    if (archived !== undefined) {
      setFields.push("archived = ?");
      queryParams.push(archived ? 1 : 0);
    }

    if (setFields.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No fields to update" });
    }

    setFields.push("updated_at = NOW()");
    queryParams.push(id);

    const setClause = setFields.join(", ");

    await connection.execute(
      `
      UPDATE tickets SET ${setClause} WHERE id = ?
    `,
      queryParams
    );

    // Fetch updated ticket
    const [rows] = await connection.execute(
      `
      SELECT t.*, c.name as category_name, u.name as created_by_name,
             assigned_user.name as assigned_to_name
      FROM tickets t
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN users u ON t.created_by = u.id
      LEFT JOIN users assigned_user ON t.assigned_to = assigned_user.id
      WHERE t.id = ?
    `,
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });
    }

    return res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("PUT tickets error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update ticket" });
  }
}

async function handleDelete(req, res, connection) {
  const { id } = req.query;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Ticket ID is required" });
  }

  try {
    const [result] = await connection.execute(
      "DELETE FROM tickets WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });
    }

    return res.json({ success: true, message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("DELETE tickets error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete ticket" });
  }
}

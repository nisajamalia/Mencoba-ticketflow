// Vercel serverless function for categories API
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
    console.error("Categories API Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

async function handleGet(req, res, connection) {
  try {
    const [rows] = await connection.execute(`
      SELECT c.*, COUNT(t.id) as ticket_count
      FROM categories c
      LEFT JOIN tickets t ON c.id = t.category_id
      GROUP BY c.id, c.name, c.description, c.color, c.created_at, c.updated_at
      ORDER BY c.name
    `);

    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error("GET categories error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch categories" });
  }
}

async function handlePost(req, res, connection) {
  const { name, description, color = "#3B82F6" } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Category name is required" });
  }

  try {
    const [result] = await connection.execute(
      `
      INSERT INTO categories (name, description, color, created_at, updated_at)
      VALUES (?, ?, ?, NOW(), NOW())
    `,
      [name, description || "", color]
    );

    const [rows] = await connection.execute(
      `
      SELECT * FROM categories WHERE id = ?
    `,
      [result.insertId]
    );

    return res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("POST categories error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create category" });
  }
}

async function handlePut(req, res, connection) {
  const { id } = req.query;
  const { name, description, color } = req.body;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Category ID is required" });
  }

  try {
    let setFields = [];
    let queryParams = [];

    if (name !== undefined) {
      setFields.push("name = ?");
      queryParams.push(name);
    }
    if (description !== undefined) {
      setFields.push("description = ?");
      queryParams.push(description);
    }
    if (color !== undefined) {
      setFields.push("color = ?");
      queryParams.push(color);
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
      UPDATE categories SET ${setClause} WHERE id = ?
    `,
      queryParams
    );

    const [rows] = await connection.execute(
      `
      SELECT * FROM categories WHERE id = ?
    `,
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    return res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("PUT categories error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update category" });
  }
}

async function handleDelete(req, res, connection) {
  const { id } = req.query;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Category ID is required" });
  }

  try {
    // Check if category has tickets
    const [ticketCheck] = await connection.execute(
      `
      SELECT COUNT(*) as ticket_count FROM tickets WHERE category_id = ?
    `,
      [id]
    );

    if (ticketCheck[0].ticket_count > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category with existing tickets",
      });
    }

    const [result] = await connection.execute(
      "DELETE FROM categories WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    return res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("DELETE categories error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete category" });
  }
}

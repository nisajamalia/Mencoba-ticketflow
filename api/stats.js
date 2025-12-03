// Vercel serverless function for statistics API
import { getConnection, handleCors } from "../lib/db.js";

export default async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) return;

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  const connection = await getConnection();

  try {
    // Get ticket statistics
    const [totalResult] = await connection.execute(
      "SELECT COUNT(*) as total FROM tickets"
    );
    const total = totalResult[0].total;

    const [statusResult] = await connection.execute(`
      SELECT 
        SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open,
        SUM(CASE WHEN status = 'in-progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed,
        SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved
      FROM tickets
    `);

    const [priorityResult] = await connection.execute(`
      SELECT 
        SUM(CASE WHEN priority = 'urgent' THEN 1 ELSE 0 END) as urgent,
        SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) as high_priority
      FROM tickets
    `);

    const [weeklyResult] = await connection.execute(`
      SELECT 
        SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN 1 ELSE 0 END) as this_week,
        SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 2 WEEK) 
                 AND created_at < DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN 1 ELSE 0 END) as last_week
      FROM tickets
    `);

    const stats = {
      total,
      open: statusResult[0].open,
      in_progress: statusResult[0].in_progress,
      closed: statusResult[0].closed,
      resolved: statusResult[0].resolved,
      urgent: priorityResult[0].urgent,
      high_priority: priorityResult[0].high_priority,
      this_week: weeklyResult[0].this_week,
      last_week: weeklyResult[0].last_week,
    };

    return res.json({ success: true, data: stats });
  } catch (error) {
    console.error("Stats API error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch statistics" });
  }
}

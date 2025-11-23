<?php
/**
 * Seeder API - Web interface for database seeding
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once '../config/database.php';

class SeederAPI {
    private $conn;
    
    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }
    
    public function getStatus() {
        try {
            $tables = ['users', 'categories', 'tickets', 'comments', 'audit_logs'];
            $counts = [];
            
            foreach ($tables as $table) {
                $stmt = $this->conn->query("SELECT COUNT(*) as count FROM $table");
                $result = $stmt->fetch();
                $counts[$table] = $result['count'];
            }
            
            return [
                'success' => true,
                'data' => $counts
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
    
    public function seedDatabase() {
        ob_start();
        
        try {
            echo "🌱 Starting database seeding...\n\n";
            
            $this->conn->beginTransaction();
            
            // Clear existing data
            $this->clearData();
            
            // Seed new data
            $this->seedUsers();
            $this->seedCategories();
            $this->seedTickets();
            $this->seedComments();
            $this->seedAuditLogs();
            
            $this->conn->commit();
            echo "✅ Database seeding completed successfully!\n";
            echo "\n📊 Summary:\n";
            echo "   • 5 Users created\n";
            echo "   • 6 Categories created\n";
            echo "   • 8 Sample tickets created\n";
            echo "   • 8 Comments created\n";
            echo "   • 7 Audit log entries created\n\n";
            
            $output = ob_get_clean();
            
            return [
                'success' => true,
                'output' => $output
            ];
            
        } catch (Exception $e) {
            $this->conn->rollback();
            ob_end_clean();
            
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
    
    public function clearData() {
        echo "🗑️  Clearing existing data...\n";
        
        // Disable foreign key checks temporarily
        $this->conn->exec('SET FOREIGN_KEY_CHECKS = 0');
        
        $tables = ['audit_logs', 'comments', 'attachments', 'tickets', 'categories', 'users'];
        
        foreach ($tables as $table) {
            $this->conn->exec("DELETE FROM $table");
            $this->conn->exec("ALTER TABLE $table AUTO_INCREMENT = 1");
        }
        
        // Re-enable foreign key checks
        $this->conn->exec('SET FOREIGN_KEY_CHECKS = 1');
        
        echo "   ✓ All data cleared\n\n";
    }
    
    private function seedUsers() {
        echo "👥 Seeding users...\n";
        
        $users = [
            ['Admin User', 'admin@ticket.com', password_hash('password', PASSWORD_DEFAULT), 'admin'],
            ['John Agent', 'agent@ticket.com', password_hash('password', PASSWORD_DEFAULT), 'agent'],
            ['Jane Customer', 'customer@ticket.com', password_hash('password', PASSWORD_DEFAULT), 'user'],
            ['Mike Wilson', 'mike@example.com', password_hash('password', PASSWORD_DEFAULT), 'user'],
            ['Sarah Davis', 'sarah@example.com', password_hash('password', PASSWORD_DEFAULT), 'agent']
        ];
        
        $query = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        
        foreach ($users as $user) {
            $stmt->execute($user);
        }
        
        echo "   ✓ Created " . count($users) . " users\n";
    }
    
    private function seedCategories() {
        echo "📂 Seeding categories...\n";
        
        $categories = [
            ['Technical Support', 'Technical issues, bugs, and system problems', '#EF4444'],
            ['Feature Request', 'New feature requests and enhancements', '#10B981'],
            ['General Inquiry', 'General questions and inquiries', '#3B82F6'],
            ['Billing', 'Billing, payment, and subscription issues', '#F59E0B'],
            ['Bug Report', 'Software bugs and unexpected behavior', '#EF4444'],
            ['Account', 'Account-related issues and requests', '#8B5CF6']
        ];
        
        $query = "INSERT INTO categories (name, description, color) VALUES (?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        
        foreach ($categories as $category) {
            $stmt->execute($category);
        }
        
        echo "   ✓ Created " . count($categories) . " categories\n";
    }
    
    private function seedTickets() {
        echo "🎫 Seeding tickets...\n";
        
        $tickets = [
            ['Login issue with mobile app', 'Cannot login to the mobile application. Getting "Invalid credentials" error even with correct password.', 'open', 'high', 1, 3, 2],
            ['Add dark mode feature', 'Would like to have a dark mode option in the application for better user experience during night time usage.', 'in-progress', 'medium', 2, 3, 2],
            ['How to reset password?', 'I forgot my password and cannot find the reset option. Can you guide me through the process?', 'open', 'low', 3, 3, null],
            ['Payment not processed', 'My payment was deducted from bank but subscription is not activated. Transaction ID: TXN123456789', 'open', 'urgent', 4, 3, 1],
            ['App crashes on startup', 'The application crashes immediately after opening. This started happening after the latest update.', 'closed', 'high', 1, 3, 2],
            ['Email notifications not working', 'I am not receiving email notifications for ticket updates.', 'open', 'medium', 1, 4, 5],
            ['Request for API documentation', 'Could you provide comprehensive API documentation?', 'open', 'low', 3, 4, null],
            ['Slow page loading times', 'The dashboard takes too long to load (over 10 seconds).', 'in-progress', 'high', 1, 4, 2]
        ];
        
        $query = "INSERT INTO tickets (title, description, status, priority, category_id, created_by, assigned_to) VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        
        foreach ($tickets as $ticket) {
            $stmt->execute($ticket);
        }
        
        echo "   ✓ Created " . count($tickets) . " tickets\n";
    }
    
    private function seedComments() {
        echo "💬 Seeding comments...\n";
        
        $comments = [
            [1, 2, 'I have investigated this issue. It seems to be related to the recent authentication system update.', false],
            [1, 3, 'Thank you for looking into this. When can I expect a fix?', false],
            [2, 2, 'Dark mode feature is currently in development. Expected completion by next week.', false],
            [4, 1, 'Payment issue resolved. Subscription has been activated. Refund processed for the duplicate charge.', false],
            [5, 2, 'Issue was caused by a memory leak in the previous version. Fixed in v2.1.3.', false],
            [6, 5, 'Checking email service configuration. Will update you within 24 hours.', false],
            [8, 2, 'Performance analysis completed. Identified database query optimization opportunities.', false],
            [1, 2, 'Internal note: Need to rollback auth changes and test thoroughly.', true]
        ];
        
        $query = "INSERT INTO comments (ticket_id, user_id, comment, is_internal) VALUES (?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        
        foreach ($comments as $comment) {
            $stmt->execute($comment);
        }
        
        echo "   ✓ Created " . count($comments) . " comments\n";
    }
    
    private function seedAuditLogs() {
        echo "📋 Seeding audit logs...\n";
        
        $logs = [
            [1, 2, 'assigned', '{"assigned_to": null}', '{"assigned_to": 2}'],
            [1, 2, 'status_changed', '{"status": "open"}', '{"status": "in-progress"}'],
            [4, 1, 'assigned', '{"assigned_to": null}', '{"assigned_to": 1}'],
            [4, 1, 'priority_changed', '{"priority": "high"}', '{"priority": "urgent"}'],
            [5, 2, 'status_changed', '{"status": "in-progress"}', '{"status": "closed"}'],
            [6, 5, 'assigned', '{"assigned_to": null}', '{"assigned_to": 5}'],
            [8, 2, 'status_changed', '{"status": "open"}', '{"status": "in-progress"}']
        ];
        
        $query = "INSERT INTO audit_logs (ticket_id, user_id, action, old_values, new_values) VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        
        foreach ($logs as $log) {
            $stmt->execute($log);
        }
        
        echo "   ✓ Created " . count($logs) . " audit log entries\n";
    }
}

// Handle requests
$seederAPI = new SeederAPI();
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'status':
        echo json_encode($seederAPI->getStatus());
        break;
        
    case 'seed':
        echo json_encode($seederAPI->seedDatabase());
        break;
        
    case 'clear':
        ob_start();
        $seederAPI->clearData();
        $output = ob_get_clean();
        echo json_encode(['success' => true, 'output' => $output]);
        break;
        
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
        break;
}
?>
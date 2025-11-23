<?php
/**
 * Excel Importer API
 * Handles the import of 100 tickets from Excel data
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once '../config/database.php';

$database = new Database();
$conn = $database->getConnection();

$action = $_GET['action'] ?? ($_POST['action'] ?? json_decode(file_get_contents('php://input'), true)['action'] ?? '');

if ($action === 'status') {
    // Get current database status
    try {
        $users = $conn->query("SELECT COUNT(*) as count FROM users")->fetch()['count'];
        $tickets = $conn->query("SELECT COUNT(*) as count FROM tickets")->fetch()['count'];
        $categories = $conn->query("SELECT COUNT(*) as count FROM categories")->fetch()['count'];
        
        echo json_encode([
            'success' => true,
            'users' => $users,
            'tickets' => $tickets,
            'categories' => $categories
        ]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    exit;
}

if ($action === 'import') {
    ob_start();
    
    try {
        echo "🚀 Starting Excel data import...\n";
        
        $conn->beginTransaction();
        
        // Step 1: Ensure categories exist
        echo "📂 Creating categories...\n";
        $categories = [
            ['Account', 'Account-related issues and requests', '#8B5CF6'],
            ['Bug Report', 'Software bugs and unexpected behavior', '#EF4444'],
            ['Techincal Support', 'Technical issues (typo from Excel)', '#3B82F6']
        ];
        
        $stmt = $conn->prepare("INSERT IGNORE INTO categories (name, description, color) VALUES (?, ?, ?)");
        foreach ($categories as $cat) {
            $stmt->execute($cat);
        }
        
        // Get category map
        $catMap = [];
        $result = $conn->query("SELECT id, name FROM categories");
        while ($row = $result->fetch()) {
            $catMap[$row['name']] = $row['id'];
        }
        echo "   ✓ Categories ready\n";
        
        // Step 2: Create users (in batches)
        echo "👥 Creating 100 users...\n";
        $users = [
            'Gerald Litwick', 'Mike Grey', 'Earl Dalton', 'Anne Perry', 'Nadia Henderson',
            'Caleb Morrison', 'Maria Johnson', 'Michael Carter', 'Ella Clark', 'Mira Blackwood',
            'Felix Hale', 'Evan Mitchell', 'Scarlett Roberts', 'Evelyn Roberts', 'Olivia Taylor',
            'Henry Turner', 'Layla Wilson', 'Alexander Wilson', 'Emma Young', 'Mia Perez',
            'Ava Brown', 'Liam Phillips', 'Lewis Green', 'Layla Young', 'Daniel Adams',
            'Mason Hill', 'Jack Scott', 'Chloe Allen', 'Nathaniel Brooks', 'Elias Voss',
            'Tristan Vale', 'Jasper Quinn', 'Alexander Wright', 'Aria Baxter', 'Luka Smith',
            'Ezra Coleman', 'Lucas Brenton', 'Selina Rojas', 'Carter Ellwood', 'Julian Maddox',
            'Cedric Morel', 'Naomi Ishikawa', 'Atlas Rowe', 'Elias North', 'Samira Rahman',
            'Phoenix Ward', 'Zayne Harper', 'Archer Beaumont', 'Jayden Crowley', 'Freya McConnell',
            'Jordan Pratt', 'Lila Fontaine', 'Theo Kingsley', 'Miles Easton', 'Ayame Kuno',
            'Bennett Walsh', 'Elias Dreher', 'Phoenix Adler', 'Leo Dumont', 'Declan Avery',
            'Cedric Montrose', 'Aria Mendel', 'Milo Arden', 'Rowan Balcombe', 'Elif Sarraf',
            'Ronan Graves', 'Zara Falkner', 'Mina Fujikawa', 'Theo Callaway', 'Milo Bernhardt',
            'August Whitman', 'Caelan Wynn', 'Griffin Lowell', 'Luca Brigham', 'Aya Rivers',
            'Liora Montes', 'Pierce Donovan', 'Rowan Callister', 'Selene Faraday', 'Carmen Briggs',
            'Ashton Reeve', 'Silas Mercer', 'Dante Kozlov', 'Nolan Westwood', 'Adrian Thoren',
            'Keiko Harumi', 'Milo Viridian', 'Grayson Cordell', 'Asano Whitfall', 'Freya Nilsson',
            'Casper Jansen', 'Nolan March', 'Lila Winterhall', 'Ella Wingate', 'Atlas Monroe',
            'Callum Ravenshill', 'Iris Davenport', 'Hana Wijaya', 'Bennett Crane', 'Farah Vale'
        ];
        
        $password = password_hash('password', PASSWORD_DEFAULT);
        $stmt = $conn->prepare("INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')");
        
        foreach ($users as $name) {
            $email = strtolower(str_replace(' ', '.', $name)) . '@example.com';
            $stmt->execute([$name, $email, $password]);
        }
        
        // Get user map
        $userMap = [];
        $result = $conn->query("SELECT id, name FROM users");
        while ($row = $result->fetch()) {
            $userMap[$row['name']] = $row['id'];
        }
        echo "   ✓ Users created\n";
        
        // Step 3: Import tickets from Excel data file
        echo "🎫 Importing 100 tickets...\n";
        require 'excel-data.php'; // This will contain the ticket data
        
        $stmt = $conn->prepare("INSERT INTO tickets (title, description, status, priority, category_id, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
        
        $imported = 0;
        foreach ($EXCEL_TICKETS as $ticket) {
            // Map status
            $status = strtolower($ticket['status']);
            if ($status == 'resolved') $status = 'closed';
            if ($status == 'in_progress') $status = 'in-progress';
            
            // Get IDs
            $categoryId = $catMap[$ticket['category']] ?? $catMap['General Inquiry'];
            $userId = $userMap[$ticket['created_by']] ?? null;
            
            if ($userId) {
                $stmt->execute([
                    $ticket['title'],
                    $ticket['description'],
                    $status,
                    strtolower($ticket['priority']),
                    $categoryId,
                    $userId,
                    $ticket['created_at']
                ]);
                $imported++;
            }
        }
        
        echo "   ✓ Imported $imported tickets\n";
        
        $conn->commit();
        echo "\n✅ Import completed successfully!\n";
        echo "📊 Summary: 100 users + $imported tickets imported\n";
        
        $log = ob_get_clean();
        echo json_encode(['success' => true, 'log' => $log, 'imported' => $imported]);
        
    } catch (Exception $e) {
        $conn->rollback();
        $log = ob_get_clean();
        echo json_encode(['success' => false, 'message' => $e->getMessage(), 'log' => $log]);
    }
    exit;
}

echo json_encode(['success' => false, 'message' => 'Invalid action']);
?>
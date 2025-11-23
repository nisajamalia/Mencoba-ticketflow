<?php
/**
 * Add more comments and duplicate some users for realistic data
 */

require_once '../config/database.php';

$database = new Database();
$conn = $database->getConnection();

try {
    echo "🔧 Enhancing database with more comments and duplicate users...\n\n";
    
    $conn->beginTransaction();
    
    // Step 1: Add duplicate users (same names but different emails)
    echo "👥 Adding duplicate users...\n";
    $password = password_hash('password', PASSWORD_DEFAULT);
    
    $duplicateUsers = [
        ['Gerald Litwick', 'gerald.litwick2@example.com'],
        ['Mike Grey', 'mike.grey2@example.com'],
        ['Anne Perry', 'anne.perry2@example.com'],
        ['Maria Johnson', 'maria.johnson2@example.com'],
        ['Ella Clark', 'ella.clark2@example.com'],
        ['Felix Hale', 'felix.hale2@example.com'],
        ['Evan Mitchell', 'evan.mitchell2@example.com'],
        ['Emma Young', 'emma.young2@example.com'],
        ['Liam Phillips', 'liam.phillips2@example.com'],
        ['Jack Scott', 'jack.scott2@example.com'],
        ['Chloe Allen', 'chloe.allen2@example.com'],
        ['Luka Smith', 'luka.smith2@example.com'],
        ['Atlas Rowe', 'atlas.rowe2@example.com'],
        ['Phoenix Ward', 'phoenix.ward2@example.com'],
        ['Freya McConnell', 'freya.mcconnell2@example.com'],
        ['Theo Kingsley', 'theo.kingsley2@example.com'],
        ['Milo Arden', 'milo.arden2@example.com'],
        ['Iris Davenport', 'iris.davenport2@example.com'],
        ['Bennett Crane', 'bennett.crane2@example.com'],
        ['Nolan March', 'nolan.march2@example.com']
    ];
    
    $userStmt = $conn->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')");
    foreach ($duplicateUsers as $user) {
        $userStmt->execute([$user[0], $user[1], $password]);
    }
    echo "   ✓ Added " . count($duplicateUsers) . " duplicate users\n";
    
    // Step 2: Add many more comments to existing tickets
    echo "💬 Adding comments to tickets...\n";
    
    // Get all tickets
    $ticketsQuery = "SELECT id, title, status, created_by FROM tickets ORDER BY id";
    $ticketsStmt = $conn->query($ticketsQuery);
    $tickets = $ticketsStmt->fetchAll();
    
    // Get agent and admin IDs
    $agentId = 2; // John Agent
    $adminId = 1; // Admin User
    
    $commentStmt = $conn->prepare("INSERT INTO comments (ticket_id, user_id, content, created_at) VALUES (?, ?, ?, ?)");
    
    $commentTemplates = [
        // Agent responses
        ["Thank you for reporting this issue. I'm looking into it now.", 'agent'],
        ["I've escalated this to our technical team for further investigation.", 'agent'],
        ["Could you please provide more details about when this started?", 'agent'],
        ["I've applied a temporary fix. Please let me know if the issue persists.", 'agent'],
        ["This has been resolved. The changes will take effect within 24 hours.", 'agent'],
        ["I understand your concern. Let me check our records and get back to you.", 'agent'],
        ["Thank you for your patience. I've updated your account settings.", 'agent'],
        ["I've processed your request. You should see the changes shortly.", 'agent'],
        ["Our team is working on this. I'll keep you updated on the progress.", 'agent'],
        ["I've confirmed the issue and forwarded it to the development team.", 'agent'],
        
        // Customer follow-ups
        ["Thank you for the quick response! I'll wait for the update.", 'customer'],
        ["The issue is still occurring. Can you please check again?", 'customer'],
        ["Great! That fixed the problem. Thank you so much!", 'customer'],
        ["I've provided the additional information you requested.", 'customer'],
        ["When can I expect this to be resolved?", 'customer'],
        ["Thanks for looking into this. Much appreciated!", 'customer'],
        ["I tried the suggested solution but it didn't work.", 'customer'],
        ["Perfect! Everything is working now. You can close this ticket.", 'customer'],
        ["Could you clarify what you mean by that?", 'customer'],
        ["I have a similar issue with another account as well.", 'customer'],
    ];
    
    $commentsAdded = 0;
    
    foreach ($tickets as $ticket) {
        // 70% chance of having comments
        if (rand(1, 100) <= 70) {
            $numComments = rand(2, 5); // 2-5 comments per ticket
            
            $ticketDate = strtotime($ticket['created_at'] ?? 'now');
            
            for ($i = 0; $i < $numComments; $i++) {
                $template = $commentTemplates[array_rand($commentTemplates)];
                $content = $template[0];
                $type = $template[1];
                
                // Alternate between agent and customer
                if ($i % 2 == 0) {
                    $userId = $agentId;
                } else {
                    $userId = $ticket['created_by'];
                }
                
                // Comments created 1-48 hours after ticket or previous comment
                $commentDate = date('Y-m-d H:i:s', $ticketDate + ($i * rand(3600, 172800)));
                
                $commentStmt->execute([
                    $ticket['id'],
                    $userId,
                    $content,
                    $commentDate
                ]);
                
                $commentsAdded++;
            }
        }
    }
    
    echo "   ✓ Added $commentsAdded comments\n";
    
    $conn->commit();
    
    // Final stats
    $stats = $conn->query("SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM tickets) as total_tickets,
        (SELECT COUNT(*) FROM comments) as total_comments,
        (SELECT COUNT(*) FROM tickets WHERE assigned_to IS NOT NULL) as assigned_tickets
    ")->fetch();
    
    echo "\n✅ Enhancement completed!\n";
    echo "📊 Updated Database Stats:\n";
    echo "   • Users: {$stats['total_users']}\n";
    echo "   • Tickets: {$stats['total_tickets']}\n";
    echo "   • Comments: {$stats['total_comments']}\n";
    echo "   • Assigned Tickets: {$stats['assigned_tickets']}\n\n";
    
} catch (Exception $e) {
    $conn->rollback();
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
?>

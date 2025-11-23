<?php
/**
 * Complete Excel Data Import Script
 * This will import all 100 tickets from your Excel file
 */

require_once '../config/database.php';

$database = new Database();
$conn = $database->getConnection();

try {
    echo "🚀 Starting import of 100 tickets...\n\n";
    
    $conn->beginTransaction();
    
    // Step 1: Ensure all categories exist
    echo "📂 Setting up categories...\n";
    $conn->exec("INSERT IGNORE INTO categories (name, description, color) VALUES 
        ('Account', 'Account-related issues and requests', '#8B5CF6'),
        ('Bug Report', 'Software bugs and unexpected behavior', '#EF4444'),
        ('Techincal Support', 'Technical issues and system problems', '#3B82F6')");
    
    // Get category IDs
    $catStmt = $conn->query("SELECT id, name FROM categories");
    $categories = [];
    while ($row = $catStmt->fetch()) {
        $categories[$row['name']] = $row['id'];
    }
    echo "   ✓ Categories ready\n";
    
    // Step 2: Create all users
    echo "👥 Creating users...\n";
    $password = password_hash('password', PASSWORD_DEFAULT);
    
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
    
    $userStmt = $conn->prepare("INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')");
    foreach ($users as $name) {
        $email = strtolower(str_replace(' ', '.', $name)) . '@example.com';
        $userStmt->execute([$name, $email, $password]);
    }
    
    // Get user IDs
    $userStmt = $conn->query("SELECT id, name FROM users");
    $userMap = [];
    while ($row = $userStmt->fetch()) {
        $userMap[$row['name']] = $row['id'];
    }
    echo "   ✓ Users created\n";
    
    // Step 3: Prepare ticket data from Excel
    echo "🎫 Importing 100 tickets...\n";
    
    $ticketStmt = $conn->prepare("INSERT INTO tickets (title, description, status, priority, category_id, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
    
    // Helper function
    function getCatId($catName, $categories) {
        return $categories[$catName] ?? $categories['General Inquiry'];
    }
    
    function mapStatus($status) {
        $status = strtolower($status);
        if ($status == 'resolved') return 'closed';
        if ($status == 'in_progress') return 'in-progress';
        return $status;
    }
    
    // All 100 tickets from Excel - importing in batches
    $imported = 0;
    
    // Batch 1: Tickets 1-25
    $batch1 = [
        ["My Friend's account got Hacked", "My Friend Luka Smith got their account hacked 2 days ago and we haven't been able to get it back yet, is there anything you can do to help get the account back or at least deactivate it till it's sorted?", "Resolved", "High", "Account", "Gerald Litwick", "2024-12-13"],
        ["Dark Mode Request", "I would like to request to add a dark mode option to the website.", "Open", "Low", "Feature Request", "Mike Grey", "2024-12-15"],
        ["Overlapping Text", "The mobile version of the website shows overlapping text when you open the home page.", "In_Progress", "Medium", "Bug Report", "Earl Dalton", "2024-12-15"],
        ["Payment Failed", "My payment for this month failed even though my card is active and has more then enough to pay for it.", "Resolved", "High", "Billing", "Anne Perry", "2024-12-18"],
        ["Change Email", "I want to change the email that is associated with my account for my new email.", "Resolved", "Medium", "Account", "Nadia Henderson", "2024-12-18"],
        ["System is down", "I can't access the system to get the important documents Boss requested.", "Resolved", "High", "Techincal Support", "Caleb Morrison", "2024-12-19"],
        ["System is down", "I can't access the system and it keeps showing me this server error no matter what I do", "Resolved", "High", "Techincal Support", "Maria Johnson", "2024-12-19"],
        ["System is down", "The system crashed and it now it's showing me this server error.", "Resolved", "High", "Techincal Support", "Michael Carter", "2024-12-19"],
        ["Dark Mode Request", "Please add a dark mode option to the website my eyes hurts everytime I see it", "Open", "Low", "Feature Request", "Ella Clark", "2024-12-20"],
        ["Feature Request", "I want the option to rename my dashboard menu items, some names are too long and just too distracting.", "Open", "Low", "Feature Request", "Mira Blackwood", "2024-12-19"],
        ["Incorrect Charge", "I was charged an extra $24 compared to the usual payments", "In_Progress", "High", "Billing", "Felix Hale", "2024-12-21"],
        ["Access Payment History", "Please help me access my payment history, I'd like to check how much I've spent over the last year", "Open", "Medium", "Billing", "Evan Mitchell", "2024-12-22"],
        ["Suspicious Login", "Is my account at risk? I noticed a login from an unknown location on my account.", "In_Progress", "Medium", "General Inquiry", "Scarlett Roberts", "2024-12-22"],
        ["Search Not Working", "The search feature is returning incorrect results to my searches.", "Resolved", "Low", "Bug Report", "Evelyn Roberts", "2024-12-23"],
        ["Button Not Responding", "Nothing happens after I clicked the submit button, what should I do?", "Resolved", "High", "Bug Report", "Olivia Taylor", "2024-12-24"],
        ["Button Not Responding", "I tried to submit my work to the database but it's stuck on the submit screen.", "Resolved", "High", "Bug Report", "Henry Turner", "2024-12-24"],
        ["Button Not Responding", "I'm stuck in the submit screen, did my work succesfully submit? Or is it not working?", "Resolved", "High", "Bug Report", "Layla Wilson", "2024-12-24"],
        ["General Question", "I want to understand how the subscription tiers work.", "Resolved", "Low", "General Inquiry", "Alexander Wilson", "2024-12-26"],
        ["File Upload Slow", "Uploading files takes much longer than expected, one simple pdf took 9 minutes.", "In_Progress", "Low", "Techincal Support", "Emma Young", "2024-12-27"],
        ["File Upload Slow", "Uploading files takes forever, I can't continue my work till this file is uploaded, make it quicker.", "In_Progress", "Low", "Techincal Support", "Mia Perez", "2024-12-27"],
        ["System Auto Log Out", "The system keeps auto-logging me out every 2 minutes.", "Resolved", "High", "Techincal Support", "Ava Brown", "2024-12-28"],
        ["Reset Password Not Working", "The link to reset my password isn't working, it just says 404 error not found.", "In_Progress", "High", "Technical Support", "Liam Phillips", "2024-12-28"],
        ["Flickering Cursor", "My cursor flickers whenever I hover over the menu options.", "Open", "Medium", "Bug Report", "Lewis Green", "2024-12-28"],
        ["Feature Request", "Please add category color tags, it will help me with organizing.", "Open", "Low", "Feature Request", "Layla Young", "2024-12-29"],
        ["Phone Number Removed", "I noticed that my recovery phone number was removed without my knowledge.", "Resolved", "High", "Account", "Daniel Adams", "2024-12-29"]
    ];
    
    foreach ($batch1 as $t) {
        $userId = $userMap[$t[5]] ?? null;
        if ($userId) {
            $ticketStmt->execute([
                $t[0], $t[1], mapStatus($t[2]), strtolower($t[3]),
                getCatId($t[4], $categories), $userId, $t[6] . ' 10:00:00'
            ]);
            $imported++;
        }
    }
    
    // Continue with remaining batches...
    echo "   Progress: $imported/100\n";
    
    // Batch 2: Tickets 26-50
    $batch2 = [
        ["Unwanted Charge", "My card was charged even though I canceled my subscription.", "Resolved", "High", "Billing", "Mason Hill", "2024-12-29"],
        ["Pausing Subscription", "Can I pause my subscription temporarily? Something urgent happened and I need to pause it for a few months for emergency funds", "In_Progress", "High", "General Inquiry", "Jack Scott", "2024-12-31"],
        ["Checking on Data", "Is my data safe after yesterday's outage? There were a few important documents that was still opened when the outage happened.", "Resolved", "High", "General Inquiry", "Chloe Allen", "2025-01-03"],
        ["Reverting Display Name", "The display name I changed this morning keeps reverting to old one, please fix it.", "In_Progress", "Low", "Account", "Nathaniel Brooks", "2025-01-03"],
        ["Can't Upload File", "I was trying to upload the new logs but it keeps failing, what should I do?", "Resolved", "High", "Bug Report", "Elias Voss", "2025-01-06"],
        ["Can't Upload File", "I am unable to upload the new results to the database, I need to upload them by tonight", "Resolved", "High", "Bug Report", "Tristan Vale", "2025-01-06"],
        ["Can't Upload File", "I can't upload anything, regardless of the file types or sizes", "Resolved", "High", "Bug Report", "Jasper Quinn", "2025-01-06"],
        ["Fake Contact?", "Someone contacted me yesterday claiming to be support center, was it a legitimate call?", "In_Progress", "High", "General Inquiry", "Alexander Wright", "2025-01-09"],
        ["Account Transfer", "How do I transfer ownership of my account? I would like to give my account to my son", "Open", "Medium", "General Inquiry", "Aria Baxter", "2025-01-09"],
        ["Revert Account Settings", "I finally got my account back, but a lot of my settings got changed is there a way to revert it back to before?", "Resolved", "Medium", "Account", "Luka Smith", "2025-01-12"],
        ["Typo in Notifications", "There is a spelling error in the Morning Announcements Notification Popup", "In_Progress", "Low", "Bug Report", "Ezra Coleman", "2025-01-13"],
        ["Custom Emotes", "Could we add custom emotes to label files with, it will help with organizing my files", "Open", "Low", "Feature Request", "Lucas Brenton", "2025-01-13"],
        ["Slow Downloads", "Downloading files took much longer than expected, a 2 GB zip file took 20 minutes.", "Resolved", "Low", "Techincal Support", "Selina Rojas", "2025-01-15"],
        ["Slow Downloads", "The download speed is way too slow, how could a 4 GB file have a 2 hour estimated time needed?", "Resolved", "Low", "Techincal Support", "Carter Ellwood", "2025-01-15"],
        ["Slow Downloads", "Downloading files takes forever, I can't continue my work without the missing file, make it quicker.", "Resolved", "Low", "Techincal Support", "Julian Maddox", "2025-01-15"],
        ["Change Email", "I want to change the email that is associated with my account for my new email.", "Resolved", "Medium", "Account", "Cedric Morel", "2025-01-17"],
        ["Request for 2FA Authentication", "Would it be possible to add 2FA Authentication for our accounts? I heard someone got hacked a while ago.", "Resolved", "High", "Feature Request", "Naomi Ishikawa", "2025-01-18"],
        ["Access Payment History", "I would like to see my Payment History of the past 2 years please.", "Open", "Medium", "Billing", "Atlas Rowe", "2025-01-21"],
        ["Incorrect Charge", "I was charged an extra $37 compared to the usual payments", "Resolved", "High", "Billing", "Elias North", "2025-01-24"],
        ["Incorrect Charge", "I was charged an extra $12 compared to the usual payments", "In_Progress", "High", "Billing", "Samira Rahman", "2025-01-24"],
        ["Typo in Notifications", "There is a spelling error in the Morning Announcements Notification Popup", "In_Progress", "Low", "Bug Report", "Phoenix Ward", "2025-01-27"],
        ["Feature Request", "Please add category color tags, it will help me with organizing.", "Open", "Low", "Feature Request", "Zayne Harper", "2025-01-27"],
        ["Merging Two Existing Accounts", "I made an alternate account when I lost access to my original account but I finally got it back. Could you merge both Accounts for me?", "Open", "Medium", "Account", "Archer Beaumont", "2025-01-28"],
        ["Change Email", "I want to change the email that is associated with my account for my new email.", "Resolved", "Medium", "Account", "Jayden Crowley", "2025-01-30"],
        ["New Color Theme Options", "Can we add more colour options? The ones we have are too boring", "Open", "Low", "Feature Request", "Freya McConnell", "2025-02-01"]
    ];
    
    foreach ($batch2 as $t) {
        $userId = $userMap[$t[5]] ?? null;
        if ($userId) {
            $ticketStmt->execute([
                $t[0], $t[1], mapStatus($t[2]), strtolower($t[3]),
                getCatId($t[4], $categories), $userId, $t[6] . ' 10:00:00'
            ]);
            $imported++;
        }
    }
    
    echo "   Progress: $imported/100\n";
    
    // Batch 3: Tickets 51-75
    $batch3 = [
        ["Fake Contact", "Someone contacted me yesterday claiming to be support center, was it a legitimate call?", "Resolved", "High", "General Inquiry", "Jordan Pratt", "2025-02-01"],
        ["Fake Contact", "Someone claiming to be support center contacted me last night, was it a legitimate call?", "In_Progress", "High", "General Inquiry", "Lila Fontaine", "2025-02-03"],
        ["Fake Contact", "Someone claiming to be the IT Team contacted me last night, Is my data really gone? Was it a genuine call?", "Open", "High", "General Inquiry", "Theo Kingsley", "2025-02-03"],
        ["Secondary Phone Number", "I would like to attach a Secondary Phone Number to my account?", "Resolved", "Low", "Account", "Miles Easton", "2025-02-03"],
        ["Access Payment History", "I would like to see my Payment History of the past 2 years please.", "Open", "Medium", "Billing", "Ayame Kuno", "2025-02-05"],
        ["System is down", "The system crashed and it now it's showing me this server error.", "Resolved", "High", "Techincal Support", "Bennett Walsh", "2025-02-06"],
        ["System is down", "I can't access the system and it keeps showing me this server error no matter what I do", "Resolved", "High", "Techincal Support", "Elias Dreher", "2025-02-06"],
        ["System is down", "I am unable to access the system upon my return to the office", "Resolved", "High", "Techincal Support", "Phoenix Adler", "2025-02-06"],
        ["System is down", "I need access to the system but it won't open no matter what", "Resolved", "High", "Techincal Support", "Leo Dumont", "2025-02-06"],
        ["Archiving Old Projects", "How do I archive my old projects? I want to clean things up to look better.", "Open", "Low", "General Inquiry", "Declan Avery", "2025-02-07"],
        ["Typo in Meeting Schedules", "The set time in the Meeting Schedules is wrong, it's supposed to be 16:00 not 06:00.", "Resolved", "High", "Bug Report", "Cedric Montrose", "2025-02-09"],
        ["Access Payment History", "I would like to see my Payment History of the past year please.", "Open", "Medium", "Billing", "Aria Mendel", "2025-02-09"],
        ["Customizable Dashboard Widgets", "I want to change my dashboard widgets to show my analytics instead, is there a way to do that?", "In_Progress", "Medium", "Feature Request", "Milo Arden", "2025-02-11"],
        ["Credit Card Rejected but Funds Deducted", "The system mentioned that my credit card had failed to pay but the funds for the payment was deducted from my card", "Resolved", "High", "Billing", "Rowan Balcombe", "2025-02-11"],
        ["Account Transfer", "How do I transfer ownership of my account? I would like to give my account to my roomate", "Open", "Medium", "General Inquiry", "Elif Sarraf", "2025-02-11"],
        ["Pausing Subscription", "Can I pause my subscription temporarily? Something urgent happened and I need to pause it for a few months for emergency funds", "In_Progress", "High", "General Inquiry", "Ronan Graves", "2025-02-13"],
        ["Multiple Notifications", "I kept on receving the same notification over and over again.", "Resolved", "Medium", "Technical Support", "Zara Falkner", "2025-02-13"],
        ["Incorrect Charge", "I was charged an extra $15 compared to the usual payments", "In_Progress", "High", "Billing", "Mina Fujikawa", "2025-02-14"],
        ["Unwanted Charge", "My card was charged even though I canceled my subscription.", "Resolved", "High", "Billing", "Theo Callaway", "2025-02-14"],
        ["Typo in Notifications", "There is a spelling error in the Morning Announcements Notification Popup", "In_Progress", "Low", "Bug Report", "Milo Bernhardt", "2025-02-14"],
        ["Custom Emotes", "Could we add custom emotes to label files with, it will help with organizing my files", "Open", "Low", "Feature Request", "August Whitman", "2025-02-14"],
        ["Flickering Cursor", "My cursor flickers whenever I hover over an image or video.", "Open", "Medium", "Bug Report", "Caelan Wynn", "2025-02-14"],
        ["Fake Contact", "Someone claiming to be support center contacted me last night, was it a legitimate call?", "In_Progress", "High", "General Inquiry", "Griffin Lowell", "2025-02-14"],
        ["Changing Payment Method", "Is there a way to add payment via gopay or dana instead of just bca? It would be more efficient", "In_Progress", "High", "Billing", "Luca Brigham", "2025-02-14"],
        ["Suspicious Login", "I noticed a login that was not me, could you check the logs to see the details?", "Resolved", "High", "General Inquiry", "Aya Rivers", "2025-02-14"]
    ];
    
    foreach ($batch3 as $t) {
        $userId = $userMap[$t[5]] ?? null;
        if ($userId) {
            $ticketStmt->execute([
                $t[0], $t[1], mapStatus($t[2]), strtolower($t[3]),
                getCatId($t[4], $categories), $userId, $t[6] . ' 10:00:00'
            ]);
            $imported++;
        }
    }
    
    echo "   Progress: $imported/100\n";
    
    // Batch 4: Tickets 76-100
    $batch4 = [
        ["Two-Factor Authentication Not Working", "I've inputted the code from my authneticator but it isn't work, what should I do?", "Resolved", "High", "Technical Support", "Liora Montes", "2025-02-14"],
        ["File Upload Slow", "Uploading files takes much longer than expected, one simple pdf took 9 minutes.", "In_Progress", "Low", "Techincal Support", "Pierce Donovan", "2025-02-15"],
        ["Slow Downloads", "The download speed is way too slow, how could a 4 GB file have a 2 hour estimated time needed?", "In_Progress", "Low", "Techincal Support", "Rowan Callister", "2025-02-15"],
        ["Slow Downloads", "Downloading files takes forever, I can't continue my work without the missing file, make it quicker.", "In_Progress", "Low", "Techincal Support", "Selene Faraday", "2025-02-15"],
        ["File Upload Slow", "Uploading files takes much longer than expected, one simple pdf took 9 minutes.", "In_Progress", "Low", "Techincal Support", "Carmen Briggs", "2025-02-15"],
        ["File Upload Slow", "Uploading files takes forever, I can't continue my work till this file is uploaded, make it quicker.", "In_Progress", "Low", "Techincal Support", "Ashton Reeve", "2025-02-15"],
        ["Dropdown Menu Scrolls Beyond Screen", "The dropdown menu scrolls down, way beyond the screen. Makes it hard to sleect the lower options", "Open", "High", "Bug Report", "Silas Mercer", "2025-02-15"],
        ["Change Email", "I want to change the email that is associated with my account for my new email.", "Resolved", "Medium", "Account", "Dante Kozlov", "2025-02-15"],
        ["Typo in Meeting Schedules", "The set time in the Meeting Schedules is wrong, it's supposed to be 16:00 not 06:00.", "Resolved", "High", "Bug Report", "Nolan Westwood", "2025-02-15"],
        ["Delayed Sync on Shared Notes", "Edits show up a minute late leading to mix-ups between the team", "Open", "Medium", "Technical Support", "Adrian Thoren", "2025-02-15"],
        ["Reverting Username", "I changed my username yesterday but my username is back to the old one when I logged in this morning", "Resolved", "Medium", "Account", "Keiko Harumi", "2025-02-16"],
        ["Reminder Notifications", "Could you add a feature that could remind me of upcoming meetings and deadlines?", "In_Progress", "Medium", "Feature Request", "Milo Viridian", "2025-02-16"],
        ["Incorrect Charge", "I was charged an extra $26 compared to the usual payments", "Open", "High", "Billing", "Grayson Cordell", "2025-02-16"],
        ["Payment Failed", "My payment for this month failed even though my card is active and has more then enough to pay for it.", "Resolved", "High", "Billing", "Asano Whitfall", "2025-02-16"],
        ["Archiving Old Projects", "How do I archive my old projects? I want to clean things up to look better.", "Open", "Low", "General Inquiry", "Freya Nilsson", "2025-02-16"],
        ["Account Transfer", "How do I transfer ownership of my account? I would like to give my account to my girlfriend", "Open", "Medium", "General Inquiry", "Casper Jansen", "2025-02-16"],
        ["Suspicious Login", "I noticed a login from an unknown location on my account, could you check if everything is okay?", "In_Progress", "Medium", "General Inquiry", "Nolan March", "2025-02-16"],
        ["Changing Payment Method", "I would like to change my current payment method to another", "In_Progress", "High", "Billing", "Lila Winterhall", "2025-02-16"],
        ["Change Phone Number", "I want to change the number that is attached to my account with my new phone number.", "Resolved", "Medium", "Account", "Ella Wingate", "2025-02-16"],
        ["Access Payment History", "I would like to see my Payment History of the past few months please.", "Open", "Medium", "Billing", "Atlas Monroe", "2025-02-17"],
        ["Secondary Phone Number", "I would like to attach a Secondary Phone Number to my account?", "Resolved", "Low", "Account", "Callum Ravenshill", "2025-02-17"],
        ["Fake Contact", "Someone claiming to be the IT Team contacted me last night, Is everything okay? Was it a genuine call?", "Open", "High", "General Inquiry", "Iris Davenport", "2025-02-17"],
        ["Fake Contact", "Someone contacted me yesterday claiming to be support center, was it a legitimate call?", "Open", "High", "General Inquiry", "Hana Wijaya", "2025-02-17"],
        ["Typo in Notifications", "There is a spelling error in the Morning Announcements Notification Popup", "In_Progress", "Low", "Bug Report", "Bennett Crane", "2025-02-17"],
        ["Unwanted Charge", "My card was charged even though I canceled my subscription.", "In_Progress", "High", "Billing", "Farah Vale", "2025-02-17"]
    ];
    
    foreach ($batch4 as $t) {
        $userId = $userMap[$t[5]] ?? null;
        if ($userId) {
            $ticketStmt->execute([
                $t[0], $t[1], mapStatus($t[2]), strtolower($t[3]),
                getCatId($t[4], $categories), $userId, $t[6] . ' 10:00:00'
            ]);
            $imported++;
        }
    }
    
    echo "   Progress: $imported/100\n";
    
    $conn->commit();
    
    echo "\n✅ Import completed successfully!\n";
    echo "📊 Final Summary:\n";
    echo "   • $imported tickets imported\n";
    echo "   • All data automatically synced to frontend\n\n";
    
} catch (Exception $e) {
    $conn->rollback();
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
?>
<?php
// Simple PHP server for demo purposes
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Simple in-memory data store for demo
session_start();

// Sample data
$users = [
    'admin@ticketing.com' => [
        'id' => 1,
        'name' => 'System Administrator',
        'email' => 'admin@ticketing.com',
        'password' => 'password',
        'role' => 'admin'
    ],
    'john@example.com' => [
        'id' => 2,
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'password',
        'role' => 'user'
    ]
];

$categories = [
    ['id' => 1, 'name' => 'Bug Report', 'slug' => 'bug-report', 'color' => '#EF4444'],
    ['id' => 2, 'name' => 'Feature Request', 'slug' => 'feature-request', 'color' => '#3B82F6'],
    ['id' => 3, 'name' => 'Technical Support', 'slug' => 'technical-support', 'color' => '#10B981']
];

$tickets = [
    [
        'id' => 1,
        'title' => 'Login page not working properly',
        'description' => 'I am unable to log in to my account. The page keeps showing an error message.',
        'priority' => 'high',
        'status' => 'open',
        'category_id' => 1,
        'user_id' => 2,
        'assigned_to' => 1,
        'created_at' => '2024-11-15T10:00:00Z',
        'category' => ['id' => 1, 'name' => 'Bug Report'],
        'user' => ['id' => 2, 'name' => 'John Doe']
    ],
    [
        'id' => 2,
        'title' => 'Add dark mode feature',
        'description' => 'It would be great to have a dark mode option for better user experience.',
        'priority' => 'medium',
        'status' => 'in_progress',
        'category_id' => 2,
        'user_id' => 2,
        'assigned_to' => 1,
        'created_at' => '2024-11-14T15:30:00Z',
        'category' => ['id' => 2, 'name' => 'Feature Request'],
        'user' => ['id' => 2, 'name' => 'John Doe']
    ]
];

// Parse the request
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

// Route handling
switch ($path) {
    case '/api/login':
        if ($method === 'POST') {
            $email = $input['email'] ?? '';
            $password = $input['password'] ?? '';
            
            if (isset($users[$email]) && $users[$email]['password'] === $password) {
                $user = $users[$email];
                unset($user['password']);
                
                $_SESSION['user'] = $user;
                $_SESSION['token'] = 'demo-token-' . $user['id'];
                
                echo json_encode([
                    'message' => 'Login successful',
                    'user' => $user,
                    'token' => $_SESSION['token'],
                    'token_type' => 'Bearer'
                ]);
            } else {
                http_response_code(422);
                echo json_encode(['message' => 'Invalid credentials']);
            }
        }
        break;
        
    case '/api/register':
        if ($method === 'POST') {
            // Simple registration - just return success for demo
            $user = [
                'id' => count($users) + 1,
                'name' => $input['name'],
                'email' => $input['email'],
                'role' => 'user'
            ];
            
            $_SESSION['user'] = $user;
            $_SESSION['token'] = 'demo-token-' . $user['id'];
            
            echo json_encode([
                'message' => 'Registration successful',
                'user' => $user,
                'token' => $_SESSION['token'],
                'token_type' => 'Bearer'
            ]);
        }
        break;
        
    case '/api/user':
        if ($method === 'GET') {
            if (isset($_SESSION['user'])) {
                echo json_encode(['user' => $_SESSION['user']]);
            } else {
                http_response_code(401);
                echo json_encode(['message' => 'Unauthorized']);
            }
        }
        break;
        
    case '/api/logout':
        if ($method === 'POST') {
            session_destroy();
            echo json_encode(['message' => 'Logout successful']);
        }
        break;
        
    case '/api/tickets':
        if ($method === 'GET') {
            echo json_encode([
                'data' => $tickets,
                'meta' => [
                    'current_page' => 1,
                    'last_page' => 1,
                    'per_page' => 15,
                    'total' => count($tickets)
                ]
            ]);
        } elseif ($method === 'POST') {
            $newTicket = [
                'id' => count($tickets) + 1,
                'title' => $input['title'],
                'description' => $input['description'],
                'priority' => $input['priority'],
                'status' => 'open',
                'category_id' => $input['category_id'],
                'user_id' => $_SESSION['user']['id'] ?? 2,
                'created_at' => date('c'),
                'category' => ['id' => $input['category_id'], 'name' => 'General'],
                'user' => $_SESSION['user'] ?? ['id' => 2, 'name' => 'John Doe']
            ];
            
            echo json_encode([
                'message' => 'Ticket created successfully',
                'data' => $newTicket
            ]);
        }
        break;
        
    case '/api/tickets-stats':
        if ($method === 'GET') {
            echo json_encode([
                'data' => [
                    'total' => count($tickets),
                    'open' => 1,
                    'in_progress' => 1,
                    'resolved' => 0,
                    'closed' => 0,
                    'high_priority' => 1
                ]
            ]);
        }
        break;
        
    case '/api/categories':
        if ($method === 'GET') {
            echo json_encode(['data' => $categories]);
        }
        break;
        
    default:
        if (preg_match('/\/api\/tickets\/(\d+)/', $path, $matches)) {
            $ticketId = (int)$matches[1];
            $ticket = null;
            
            foreach ($tickets as $t) {
                if ($t['id'] === $ticketId) {
                    $ticket = $t;
                    break;
                }
            }
            
            if ($ticket) {
                echo json_encode(['data' => $ticket]);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Ticket not found']);
            }
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Route not found']);
        }
        break;
}
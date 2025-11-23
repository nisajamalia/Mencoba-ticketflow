# 🗄️ Ticketing System Database Structure

## 📊 Database Overview

**Database Name**: `ticketing_system`  
**Engine**: MySQL  
**Tables**: 6 tables with relationships

---

## 🏗️ Database Schema Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     USERS       │    │   CATEGORIES    │    │    TICKETS      │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │    │ id (PK)         │    │ id (PK)         │
│ name            │◄──┐│ name            │◄──┐│ title           │
│ email (UNIQUE)  │   ││ description     │   ││ description     │
│ password        │   ││ color           │   ││ status          │
│ role            │   ││ created_at      │   ││ priority        │
│ created_at      │   ││ updated_at      │   ││ category_id (FK)│──┘
│ updated_at      │   │└─────────────────┘   ││ assigned_to (FK)│──┘
└─────────────────┘   │                      │ created_by (FK) │──┘
         ▲            │                      │ created_at      │
         │            │                      │ updated_at      │
         └────────────┼──────────────────────┼─────────────────┘
                      │                      │
                      │                      ▼
┌─────────────────┐   │              ┌─────────────────┐
│   COMMENTS      │   │              │  ATTACHMENTS    │
├─────────────────┤   │              ├─────────────────┤
│ id (PK)         │   │              │ id (PK)         │
│ ticket_id (FK)  │───┘              │ ticket_id (FK)  │───┐
│ user_id (FK)    │──────────────────│ filename        │   │
│ comment         │                  │ original_name   │   │
│ is_internal     │                  │ file_path       │   │
│ created_at      │                  │ file_size       │   │
└─────────────────┘                  │ mime_type       │   │
                                     │ uploaded_by (FK)│───┼──┐
                                     │ created_at      │   │  │
                                     └─────────────────┘   │  │
                                              ▲            │  │
                                              │            │  │
                                     ┌─────────────────┐   │  │
                                     │   AUDIT_LOGS    │   │  │
                                     ├─────────────────┤   │  │
                                     │ id (PK)         │   │  │
                                     │ ticket_id (FK)  │───┘  │
                                     │ user_id (FK)    │──────┘
                                     │ action          │
                                     │ old_values      │
                                     │ new_values      │
                                     │ created_at      │
                                     └─────────────────┘
```

---

## 📋 Table Details

### 1. 👥 **USERS Table**

```sql
- id: INT (Primary Key, Auto Increment)
- name: VARCHAR(255) - Full name
- email: VARCHAR(255) UNIQUE - Login email
- password: VARCHAR(255) - Hashed password
- role: ENUM('admin', 'agent', 'user') - User role
- created_at: TIMESTAMP - Registration date
- updated_at: TIMESTAMP - Last update
```

**Purpose**: Stores user accounts (customers, agents, administrators)

### 2. 📂 **CATEGORIES Table**

```sql
- id: INT (Primary Key, Auto Increment)
- name: VARCHAR(255) - Category name
- description: TEXT - Category description
- color: VARCHAR(7) - Hex color code for UI
- created_at: TIMESTAMP - Creation date
- updated_at: TIMESTAMP - Last update
```

**Purpose**: Ticket categorization (Technical, Billing, etc.)

### 3. 🎫 **TICKETS Table** (Main Entity)

```sql
- id: INT (Primary Key, Auto Increment)
- title: VARCHAR(500) - Ticket subject
- description: TEXT - Detailed description
- status: ENUM('open', 'in-progress', 'closed')
- priority: ENUM('low', 'medium', 'high', 'urgent')
- category_id: INT (Foreign Key → categories.id)
- assigned_to: INT (Foreign Key → users.id) - Agent
- created_by: INT (Foreign Key → users.id) - Customer
- created_at: TIMESTAMP - Creation date
- updated_at: TIMESTAMP - Last update
```

**Purpose**: Core ticket information and tracking

### 4. 💬 **COMMENTS Table**

```sql
- id: INT (Primary Key, Auto Increment)
- ticket_id: INT (Foreign Key → tickets.id)
- user_id: INT (Foreign Key → users.id)
- comment: TEXT - Comment content
- is_internal: BOOLEAN - Internal note or public
- created_at: TIMESTAMP - Comment date
```

**Purpose**: Ticket conversations and updates

### 5. 📎 **ATTACHMENTS Table**

```sql
- id: INT (Primary Key, Auto Increment)
- ticket_id: INT (Foreign Key → tickets.id)
- filename: VARCHAR(255) - Stored filename
- original_name: VARCHAR(255) - Original filename
- file_path: VARCHAR(500) - File location
- file_size: INT - File size in bytes
- mime_type: VARCHAR(100) - File type
- uploaded_by: INT (Foreign Key → users.id)
- created_at: TIMESTAMP - Upload date
```

**Purpose**: File attachments for tickets

### 6. 📋 **AUDIT_LOGS Table**

```sql
- id: INT (Primary Key, Auto Increment)
- ticket_id: INT (Foreign Key → tickets.id)
- user_id: INT (Foreign Key → users.id)
- action: VARCHAR(100) - Action performed
- old_values: JSON - Previous values
- new_values: JSON - New values
- created_at: TIMESTAMP - Action date
```

**Purpose**: Change tracking and history

---

## 🔗 Relationships

### **One-to-Many Relationships:**

- **Users → Tickets (created_by)**: One user can create many tickets
- **Users → Tickets (assigned_to)**: One agent can be assigned many tickets
- **Categories → Tickets**: One category can have many tickets
- **Tickets → Comments**: One ticket can have many comments
- **Tickets → Attachments**: One ticket can have many attachments
- **Tickets → Audit Logs**: One ticket can have many audit entries
- **Users → Comments**: One user can make many comments
- **Users → Attachments**: One user can upload many attachments
- **Users → Audit Logs**: One user can perform many actions

### **Referential Integrity:**

- **ON DELETE CASCADE**: When a ticket is deleted, all related comments, attachments, and audit logs are deleted
- **ON DELETE SET NULL**: When a category/user is deleted, related tickets keep their references but set to NULL

---

## 📊 Sample Data Structure

### **Users (5 records)**

```
1. Admin User (admin@ticket.com) - Role: admin
2. John Agent (agent@ticket.com) - Role: agent
3. Jane Customer (customer@ticket.com) - Role: user
4. Mike Wilson (mike@example.com) - Role: user
5. Sarah Davis (sarah@example.com) - Role: agent
```

### **Categories (6 records)**

```
1. Technical Support (#EF4444 - Red)
2. Feature Request (#10B981 - Green)
3. General Inquiry (#3B82F6 - Blue)
4. Billing (#F59E0B - Orange)
5. Bug Report (#EF4444 - Red)
6. Account (#8B5CF6 - Purple)
```

### **Tickets (8 records)**

```
1. Login issue with mobile app (High Priority, Open)
2. Add dark mode feature (Medium Priority, In-Progress)
3. How to reset password? (Low Priority, Open)
4. Payment not processed (Urgent Priority, Open)
5. App crashes on startup (High Priority, Closed)
6. Email notifications not working (Medium Priority, Open)
7. Request for API documentation (Low Priority, Open)
8. Slow page loading times (High Priority, In-Progress)
```

---

## 🛠️ Seeder Interface Features

The web-based seeder interface provides:

- **Real-time database status** showing current record counts
- **One-click data seeding** to populate all tables
- **Data clearing** to reset the database
- **Status monitoring** to track changes

Access at: **http://localhost/ticketing-website/backend/database/seeder-interface.html**

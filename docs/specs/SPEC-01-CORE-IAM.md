# SPEC-01: Core Platform Architecture, IAM & Multi-Project Tenancy

> **Module**: 01. Core Platform & Identity Access Management (IAM)  
> **Author**: BA Agent / Lead Architect  
> **Status**: Approved  
> **Stack**: Java 21 + Spring Boot 3.3.x + Spring Security 6 + PostgreSQL 17 + React 18 + TypeScript

---

## 1. Business Objectives & Context

Ánh Dương Building (ADB) operates multiple high-value construction projects simultaneously across industrial zones. The Core IAM module must guarantee:
- Robust multi-role separation (Board of Directors, Project Director, Chief Accountant, Chief Engineer / Site Manager, Quantity Surveyor (QS), Safety Officer, Subcontractor Representatives).
- Token-based stateless authentication (JWT with access + refresh token rotation).
- Granular permission-based access control (RBAC) per project.
- Comprehensive security audit logging of all data mutations.

---

## 2. Database Schema (PostgreSQL DDL)

```sql
-- Schema: core_iam
CREATE SCHEMA IF NOT EXISTS core_iam;

-- Table: roles
CREATE TABLE IF NOT EXISTS core_iam.roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: permissions
CREATE TABLE IF NOT EXISTS core_iam.permissions (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL,
    description VARCHAR(255)
);

-- Table: role_permissions
CREATE TABLE IF NOT EXISTS core_iam.role_permissions (
    role_id BIGINT REFERENCES core_iam.roles(id) ON DELETE CASCADE,
    permission_id BIGINT REFERENCES core_iam.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- Table: users
CREATE TABLE IF NOT EXISTS core_iam.users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    role_id BIGINT REFERENCES core_iam.roles(id),
    department VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: audit_logs
CREATE TABLE IF NOT EXISTS core_iam.audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES core_iam.users(id),
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    details JSONB,
    ip_address VARCHAR(50),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. REST API Specifications

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/auth/login` | Authenticate user, returns JWT access & refresh tokens | No |
| `POST` | `/api/v1/auth/refresh` | Exchange refresh token for new access token | No |
| `GET` | `/api/v1/auth/me` | Get current authenticated user profile and permissions | Yes |
| `GET` | `/api/v1/users` | List all system users with pagination & role filtering | Yes (`USER_READ`) |
| `POST` | `/api/v1/users` | Create a new user account | Yes (`USER_WRITE`) |
| `PUT` | `/api/v1/users/{id}` | Update existing user details | Yes (`USER_WRITE`) |
| `GET` | `/api/v1/roles` | List all system roles and their permissions | Yes (`ROLE_READ`) |
| `GET` | `/api/v1/audit-logs` | Retrieve system audit logs | Yes (`AUDIT_READ`) |

---

## 4. Frontend Requirements

- **Login Screen**: Clean, professional branded interface with "Ánh Dương Building ERP" branding, form validation, error banners, and "Remember me" option.
- **Top Navigation Bar**: User profile avatar, current role indicator, quick project selector, notification center, and theme switcher (Dark/Light).
- **Sidebar**: Dynamic menu tree rendered based on current user permissions.
- **User Management Page**: Responsive data table with search, role badges, status toggle, and modal for adding/editing users.

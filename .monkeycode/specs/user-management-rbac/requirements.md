# 需求文档：用户管理与权限分离

## Introduction

现有项目为部署在 Vercel 上的纯静态个人作品集站点（HTML + CSS + JS，无后端）。本功能为其引入用户管理与基于角色的权限分离（RBAC）：新增托管数据库（Vercel Marketplace Postgres / Neon）与后端服务，实现登录认证、用户管理、角色划分与内容操作权限控制。

站点内容分两类：**展示页**（作品、创作、关于、联系等公开内容）与**管理功能**（维护作品/创作内容）。本功能将区分管理员（admin）、内容编辑（editor）与访客（visitor）三类身份，并对内容管理操作进行权限校验。

## Glossary

- **系统（System）**：作品集站点及其配套后端服务与数据库。
- **访客（visitor）**：未登录或未注册的公开访问者，仅可浏览展示页。
- **内容编辑（editor）**：已登录用户，可维护作品与创作内容。
- **管理员（admin）**：已登录用户，拥有内容编辑全部权限，并可管理用户、分配角色。
- **内容管理操作**：对作品（works）与创作（creates）内容的创建、修改、删除。
- **Vercel Marketplace Postgres**：由 Vercel 集成提供的 Neon Postgres 托管数据库。

## Requirements

### 需求 1：用户认证

**User Story:** AS 管理员，I want 登录系统，so that 访问受保护的管理功能。

#### Acceptance Criteria

1. WHEN 用户提交邮箱与密码，系统 SHALL 校验凭据；校验通过时发放会话令牌，校验失败时返回错误信息。
2. WHILE 用户持有有效会话令牌，系统 SHALL 识别用户身份与其角色。
3. IF 会话令牌缺失、过期或无效，系统 SHALL 拒绝访问受保护资源，并引导用户登录。

### 需求 2：注册策略

**User Story:** AS 管理员，I want 控制账号创建方式，so that 站点账号可被管控。

#### Acceptance Criteria

1. WHEN 系统初始化且无任何用户，系统 SHALL 提供首次管理员创建流程。
2. WHEN 管理员创建新用户，系统 SHALL 记录邮箱、密码与分配的角色。
3. WHEN 访客尝试自助注册账号，系统 SHALL 拒绝该操作。
4. IF 新用户邮箱已存在，系统 SHALL 拒绝创建并返回提示。

### 需求 3：用户管理

**User Story:** AS 管理员，I want 管理用户与角色，so that 权限分配可控。

#### Acceptance Criteria

1. WHEN 管理员查看用户列表，系统 SHALL 展示用户邮箱、角色、状态与创建时间。
2. WHEN 管理员修改用户角色，系统 SHALL 更新用户权限并使其在下次请求生效。
3. WHEN 管理员停用用户，系统 SHALL 使该用户的会话令牌立即失效。
4. IF 管理员尝试停用最后一个启用的管理员，系统 SHALL 拒绝该操作。

### 需求 4：角色与权限

**User Story:** AS 系统，I want 基于角色控制操作权限，so that 不同身份访问不同能力。

#### Acceptance Criteria

1. WHEN 访客访问管理功能，系统 SHALL 拒绝访问并提示登录。
2. WHEN 内容编辑执行内容管理操作，系统 SHALL 允许该操作。
3. WHEN 内容编辑访问用户管理功能，系统 SHALL 拒绝访问。
4. WHEN 管理员执行内容管理操作与用户管理操作，系统 SHALL 允许该操作。

### 需求 5：内容管理

**User Story:** AS 内容编辑或管理员，I want 维护作品与创作内容，so that 展示内容可更新。

#### Acceptance Criteria

1. WHEN 已授权用户创建作品或创作条目，系统 SHALL 将条目写入数据库并展示。
2. WHEN 已授权用户修改或删除条目，系统 SHALL 更新数据库并使展示页反映变更。
3. WHILE 未登录，系统 SHALL 仅展示公开的只读内容。

### 需求 6：安全

**User Story:** AS 系统，I want 保障认证与会话安全，so that 用户凭据不被泄露。

#### Acceptance Criteria

1. WHEN 系统存储用户密码，系统 SHALL 使用单向哈希（加盐）存储，禁止明文保存。
2. WHEN 系统传输敏感数据，系统 SHALL 使用加密传输（HTTPS）。
3. WHEN 系统后端收到内容管理或用户管理请求，系统 SHALL 校验请求者权限后方可执行。
4. IF 同一账号登录失败达到设定次数，系统 SHALL 限流或临时锁定以阻止暴力破解。

### 需求 7：技术栈与部署

**User Story:** AS 开发者，I want 使用托管数据库、Next.js 与 Vercel 部署，so that 无需自建服务器。

#### Acceptance Criteria

1. WHEN 系统部署到 Vercel，系统 SHALL 使用 Vercel Marketplace Postgres 存储用户与内容数据。
2. WHEN 系统实现后端逻辑，系统 SHALL 基于 Next.js App Router 与 API Routes 提供服务。
3. WHEN 系统实现认证与会话，系统 SHALL 使用 better-auth 认证库处理登录、会话与密码哈希。
4. WHEN 系统本地开发，系统 SHALL 支持连接同一数据库实例或本地等效数据库。
5. WHEN 数据库结构变更，系统 SHALL 通过受控迁移方式应用变更，保证数据不丢失。

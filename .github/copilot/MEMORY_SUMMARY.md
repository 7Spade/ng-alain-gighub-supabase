# GitHub Copilot Memory Summary

> **Last Updated**: 2025-11-21  
> **Version**: v4.2 (AI Tool Integration)  
> **Total Entities**: 167  
> **Total Relations**: 207  
> **Total Lines**: 420  
> **Status**: ✅ 已更新 - 整合 Sequential Thinking 和 Software Planning Tool

## 📊 Overview

This document provides a summary of the organized `memory.jsonl` file, which contains the knowledge base for GitHub Copilot to assist with the ng-alain-gighub project development.

## 🗂️ Entity Categories (34 categories)

| Category | Count | Description |
|----------|-------|-------------|
| **Standard** | 48 | Development standards and coding conventions |
| **Feature** | 19 | Project features and functionality (including AI Tool Integration) |
| **Principle** | 15 | Core development principles (including Thinking-First Development, Structured Problem Solving) |
| **Development Tool** | 2 | AI development tools (Sequential Thinking Tool, Software Planning Tool) |
| **Documentation** | 9 | Documentation structure and files |
| **UI Pattern** | 7 | User interface design patterns |
| **Development Practice** | 6 | Layer-specific development practices |
| **Security** | 6 | Security best practices and standards |
| **Architecture** | 5 | System architecture patterns |
| **DevOps** | 5 | DevOps practices and CI/CD |
| **Pattern** | 12 | Design patterns (Repository, Facade, ErrorStateService, BlueprintActivityService, Aggregation Refresh, Facade Coordination, Supabase Storage, Workspace Context Implementation, Task State Machine, Task Dependency Management, etc.) |
| **Workspace** | 3 | Workspace context system |
| **Performance** | 3 | Performance optimization techniques |
| **Checklist** | 2 | Development checklists |
| **Constraint** | 2 | Development constraints and limitations |
| **Tool Configuration** | 2 | IDE and tool configurations |
| **Process** | 2 | Team collaboration processes |
| **Project** | 2 | Project metadata |
| Other categories | 19 | Various specialized categories |

## 🔗 Relation Types (40 types)

Top 10 relation types by frequency:

1. **uses** (26): Technology and library usage relationships
2. **implements** (21): Implementation relationships
3. **enforces** (14): Enforcement of standards and rules
4. **partOf** (12): Hierarchical relationships
5. **integrates_with** (9): Integration relationships
6. **requires** (9): Dependency relationships
7. **improves** (8): Quality improvement relationships
8. **defines** (7): Definition relationships
9. **documents** (7): Documentation relationships
10. **supports** (7): Support relationships

## 📝 New Content Added in v4.2

### AI Tool Integration (✨ v4.2 新增)

The following 6 entities were added to integrate AI development tools:

1. **Sequential Thinking Tool** (Development Tool)
   - Used for deep analysis and structured thinking of complex problems
   - Supports thinking chains (thoughtNumber, totalThoughts)
   - Allows revision of previous thoughts (isRevision, revisesThought)
   - Supports branch exploration (branchFromThought, branchId)
   - Can dynamically adjust thinking steps (needsMoreThoughts)
   - Use cases: architecture design, technology selection, complex problem analysis

2. **Software Planning Tool** (Development Tool)
   - Used for task planning, decomposition, and progress tracking
   - Supports planning sessions (start_planning)
   - Supports task management (add_todo, remove_todo, get_todos, update_todo_status)
   - Supports plan saving (save_plan)
   - Tasks include: title, description, complexity, codeExample
   - Complexity assessment: 1-2 (simple), 3-4 (medium), 5-6 (moderate), 7-8 (complex), 9-10 (very complex)

3. **Tool-Assisted Development Pattern** (Pattern)
   - Tool-assisted development pattern: Thinking → Planning → Execution → Reflection
   - Uses Sequential Thinking for requirement analysis and architecture design
   - Uses Software Planning Tool for task decomposition and progress tracking
   - Integrates with memory database: query standards → follow rules → record experience
   - Improves development quality: reduces rework, lowers risks, increases efficiency

4. **Thinking-First Development** (Principle)
   - Think-first development principle: think before executing complex tasks
   - Avoids rework caused by blind coding
   - Identifies risks in advance through deep analysis
   - Structured thinking ensures solution completeness
   - Applicable to: complex feature development, architecture design, technology selection, problem diagnosis

5. **AI Tool Integration** (Feature)
   - AI tools integrated into development workflow
   - Sequential Thinking Tool: deep analysis tool
   - Software Planning Tool: task management tool
   - Memory database (memory.jsonl): knowledge management tool
   - Tool synergy improves development efficiency

6. **Structured Problem Solving** (Principle)
   - Structured problem-solving method
   - Step-by-step thinking: decompose complex problems into multiple steps
   - Verification mechanism: verify correctness of each step
   - Correction mechanism: correct errors promptly when found
   - Branch exploration: explore multiple possible solutions
   - Supported by Sequential Thinking Tool

### Relations Added in v4.2

14 new relations were added to connect the AI tools with existing development processes:
- Sequential Thinking Tool → Structured Problem Solving, Code Quality, Thinking-First Development
- Software Planning Tool → Tool-Assisted Development Pattern, Development Validation Sequence
- Tool-Assisted Development Pattern → Five Layer Development Order, Enterprise Development Principles
- Thinking-First Development → Four Core Development Principles, Common Sense Principle
- AI Tool Integration → ng-alain-gighub, Development Phase Validation, Sequential Thinking Tool, Software Planning Tool

### Documentation Added in v4.2

2 comprehensive guides were created:
- **TOOL-GUIDE.md** (17.8KB): Complete AI tool usage guide with examples and best practices
- **DEVELOPMENT-WORKFLOWS.md** (23.3KB): Real-world development workflow examples with 3 complete cases

## 📝 New Content Added in v4.1

### Core Service Implementation Patterns (✨ v4.1 新增)

The following 12 entities were added to document core service implementation patterns:

1. **ErrorStateService Pattern** (Pattern)
   - Unified error state management using Angular Signals
   - Error categories: Network, BusinessLogic, Validation, Permission, System
   - Auto-dismissal mechanism (5 seconds default)
   - Error history tracking (max 100 entries)

2. **BlueprintActivityService Pattern** (Pattern)
   - Activity logging for audit trail
   - Automatic sensitive field filtering
   - Change difference calculation (oldValue vs newValue)
   - Non-invasive logging (failures don't affect main flow)

3. **Aggregation Refresh Pattern** (Pattern)
   - Automatic data refresh when related resources change
   - Uses RealtimeFacade to listen to Supabase Realtime events
   - Debounced refresh (1 second default)
   - Multi-blueprint subscription management

4. **Facade Coordination Pattern** (Pattern)
   - Main Facade coordinates multiple sub-Facades
   - Exposes Service Signal states through Facade
   - Integrates ErrorStateService and BlueprintActivityService
   - Provides unified interface to Component layer

5. **Supabase Storage Pattern** (Pattern)
   - File upload workflow: select → validate → upload → save metadata
   - Signed URL protection
   - Automatic thumbnail generation
   - Soft delete mechanism

6. **Workspace Context Implementation** (Pattern)
   - WorkspaceContextFacade manages current context (user/team/organization)
   - Automatic route parameter replacement
   - Context switching updates menus and routes

7. **Task State Machine** (Pattern)
   - Task state transitions: pending → in_progress → staging → quality_check → acceptance → completed
   - Permission and precondition validation
   - Automatic related operations triggering

8. **Task Dependency Management** (Pattern)
   - TaskDependencyService manages task dependencies
   - Supports blocking and non-blocking dependencies
   - Circular dependency detection
   - Dependency graph building

9. **Realtime Communication System** (Feature)
   - RealtimeFacade encapsulates Supabase Realtime functionality
   - Table-level subscriptions (INSERT, UPDATE, DELETE)
   - Subscription lifecycle management

10. **Explore Module** (Feature)
    - Global search for Account and Blueprint
    - Context filtering (global, current-context, current-org, current-team)
    - Quick context switching

11. **Dashboard Module** (Feature)
    - Aggregates multiple data sources
    - Uses Aggregation Refresh Pattern for real-time updates
    - Customizable dashboard configuration

12. **Daily Report System** (Feature)
    - Daily reports: work summary, hours, worker count, photos, weather
    - Photos stored in Supabase Storage
    - Weather data via Edge Function API with caching

### Relations Added in v4.1

23 new relations were added to connect the new service implementation patterns:
- ErrorStateService Pattern → Facades Layer Development/Error Handling Strategy
- BlueprintActivityService Pattern → Facades Layer Development/Activity Logging System
- Aggregation Refresh Pattern → Facades Layer Development/Realtime Communication System
- Facade Coordination Pattern → Facades Layer Development/ErrorStateService Pattern/BlueprintActivityService Pattern
- Supabase Storage Pattern → Document Management System/File Upload Standards
- Workspace Context Implementation → Workspace Context System/Route Parameter Replacement
- Task State Machine → Task Tree Structure
- Task Dependency Management → Task Tree Structure
- Realtime Communication System → Aggregation Refresh Pattern/Supabase
- Explore Module → Workspace Context System/Search Functionality
- Dashboard Module → Data Analysis System/Aggregation Refresh Pattern
- Daily Report System → Task Execution System/Supabase Storage Pattern

## 📝 Previous Content Added from Development Guide

The following entities were added from `docs/archive/開發順序.md`:

### Workflow Entities

1. **Five Layer Development Order** (Workflow)
   - Standard development order: Types → Repositories → Models → Services → Facades → Routes/Components → Tests
   - 7 development steps with priorities and dependencies

### Development Practice Entities

2. **Types Layer Development** (Development Practice)
   - Location: `src/app/core/infra/types/`
   - Priority: P0 (must be completed first)
   - Responsibility: Generate database.types.ts from Supabase

3. **Repositories Layer Development** (Development Practice)
   - Location: `src/app/core/infra/repositories/`
   - Priority: P0 (depends on Types layer)
   - Responsibility: Encapsulate database access, handle snake_case ↔ camelCase conversion

4. **Models Layer Development** (Development Practice)
   - Location: `src/app/shared/models/`
   - Priority: P0 (can be developed in parallel with Repositories)
   - Responsibility: Define business models (camelCase)

5. **Services Layer Development** (Development Practice)
   - Location: `src/app/shared/services/`
   - Priority: P0 (depends on Repositories + Models)
   - Responsibility: Business logic processing, state management with Signals

6. **Facades Layer Development** (Development Practice)
   - Location: `src/app/core/facades/`
   - Priority: P0 (depends on Services)
   - Responsibility: Unified external interface, coordinate multiple Services

7. **Routes Components Layer Development** (Development Practice)
   - Location: `src/app/routes/`
   - Priority: P0 (depends on Facades)
   - Responsibility: UI components, user interaction handling, routing configuration

### Checklist Entities

8. **Development Pre-Check** (Checklist)
   - Requirement analysis, database design, architecture planning, development preparation

9. **Development Post-Check** (Checklist)
   - Code quality check, functional verification, enterprise standards final check, documentation update

### Principle Entities

10. **Four Core Development Principles** (Principle)
    - Common Practices: Follow industry standards
    - Enterprise Standards: Clear code structure, well-defined responsibilities
    - Logical Consistency: Clear data flow, semantic naming
    - Common Sense: Truly usable functions, user experience first

11. **Development Validation Sequence** (Standard)
    - Complete validation sequence: lint → lint:style → type-check → build → test
    - Pre-commit hook and CI/CD enforcement

## 🔄 Relations Added

11 new relations were added to connect the development workflow entities:

- Five Layer Development Order → Five Layer Architecture (implements)
- Types/Repositories/Models/Services/Facades/Routes Layer Development → Five Layer Development Order (partOf)
- Development Pre-Check/Post-Check → Four Core Development Principles (validates)
- Development Validation Sequence → Validation Sequence (implements)
- Four Core Development Principles → Enterprise Development Principles (defines)

## 📚 Key References

- **Development Guide**: `docs/archive/開發順序.md`
- **Agent Instructions**: `AGENTS.md`, `.github/agents/copilot-instructions.md`
- **Architecture Documentation**: `docs/20-完整架構流程圖.mermaid.md`, `docs/21-架構審查報告.md`
- **Database Schema**: `docs/22-完整SQL表結構定義.md`

## 🔍 How to Use This Memory

GitHub Copilot uses this memory to:

1. **Understand project context**: Architecture, tech stack, conventions
2. **Follow development standards**: Coding style, naming conventions, best practices
3. **Respect development workflow**: Five-layer architecture, development order
4. **Apply quality checks**: Four core principles, validation sequence
5. **Generate appropriate code**: Consistent with project standards and patterns

## 🛠️ Maintenance

To maintain this memory:

1. **Add new entities**: When introducing new patterns, standards, or features
2. **Update observations**: When standards or practices change
3. **Add relations**: To show connections between entities
4. **Organize regularly**: Keep entities grouped by category
5. **Validate JSON**: Ensure all lines are valid JSON format

## 📊 Statistics

```text
├── Entities: 161 (45.5%)
└── Relations: 193 (54.5%)

Entity categories: 33
Relation types: 40+

Largest category: Standard (48 entities)
Most common relation: uses (26+ occurrences)
```

## ✅ Validation

All JSON lines have been validated and are syntactically correct. The memory file is ready for use by GitHub Copilot.

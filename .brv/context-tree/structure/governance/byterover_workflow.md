## Raw Concept
**Task:**
Define ByteRover CLI workflow and agent integration rules

**Files:**
- BYTEROVER_GUIDE.md
- AGENTS.md

**Timestamp:** 2026-02-16

## Narrative
### Structure
BYTEROVER_GUIDE.md provides a quick start for manual CLI usage. AGENTS.md defines MCP integration rules for AI agents.

### Features
Workflow includes: Login -> Start Instance (brv) -> Query -> Code -> Curate -> Push.

### Rules
1. Query First: Automatically call the mcp tool brv-query when you need context.
2. Curate Later: After finishing the task, call brv-curate to store back important knowledge.
3. Keep brv instance running for query and curate commands.
4. Push local context tree to cloud using brv push -y.

### Examples
Query: brv query "How is authentication implemented?"
Curate: brv curate "Web auth uses HTTP-only cookie sessions..." --files apps/web/...

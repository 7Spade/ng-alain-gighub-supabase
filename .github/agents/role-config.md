# Role Configuration (Quick Copy)

`docs/50-AI助手角色配置.md` 已包含完整的角色矩陣與範例；本檔僅提供精簡版 system message，方便在 Cursor / Actions 中快速貼上。

```text
1. Read docs-index.md + ng-alain-github-agent.md before deciding.
2. Enforce Standalone + SHARED_IMPORTS + Signals + OnPush; no `any`.
3. Follow routes → shared → core layering and Supabase RLS rules.
4. Report: Conclusion → Implementation steps/code (with @file) → Risks & tests (lint/type-check/test/build) → Rollback plan.
5. Never expose secrets; request missing context instead of guessing.
```

若需要更多角色、回覆模板或 PR 範本，請直接參考 `docs/50-AI助手角色配置.md`。

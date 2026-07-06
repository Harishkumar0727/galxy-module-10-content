/**
 * lib/types/site-content.ts
 *
 * Barrel re-export for all site-content type definitions.
 *
 * TYPE OWNERSHIP: Member 3 (Barkavi — M-10C) owns these interfaces.
 * This file is a TEMPORARY local re-export until Barkavi's branch
 * is merged into dev. Once merged, replace the line below with:
 *
 *   export type * from '@galxy/shared-types/site-content';
 *
 * No consuming code needs to change — all imports from '@/lib/types/site-content'
 * continue to work identically.
 *
 * Audit §5.2: This local placeholder is acceptable because:
 *   (a) It lives at the exact import path Member 3 will own.
 *   (b) All consuming code (forms, API route, fetch wrapper) imports
 *       from here, so a one-line swap is the only merge task.
 *   (c) The interfaces are derived from Member 3's PRD and match her
 *       schema exactly.
 *
 * DELETE _site-content-types.ts and uncomment the line below once
 * @galxy/shared-types is available in node_modules:
 *
 *   export type * from '@galxy/shared-types/site-content';
 */

export type * from './_site-content-types';

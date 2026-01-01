/**
 * Z-Index Stacking Context Management
 *
 * This module defines the z-index values for the application following the
 * "Top Layer" architecture as defined in:
 * - docs/C_Page_REQUIREMENTS/C_0_PageLayerManagement_Guidelines.md
 *
 * Layer Structure:
 * - L2 (Top Layer): 2000+  (Native <dialog>, Popover API)
 * - L1 (App Shell):  100+  (Fixed Header, Sidebar, ActionBar)
 * - L0 (Content):    0     (Regular content flow)
 */

export const zIndex = {
  // Level 0: Content Layer (Normal document flow)
  content: 0,
  contentPositioned: 1,

  // Level 1: App Shell (Fixed navigation, sticky headers)
  appBar: 100,
  stickyHeader: 100,
  actionBar: 100,
  sidebar: 100,
  drawer: 100,
  stickyTooltip: 101, // Slightly above app shell for visibility

  // Level 2: Top Layer (Modals, Dialogs, Popovers)
  modal: 1000,
  dialog: 1000,
  alertDialog: 1000,
  popover: 1001,
  select: 1001,
  menubar: 1001,
  dropdown: 1001,
  contextMenu: 1001,
  tooltip: 1001,
  notification: 9999, // Global notifications stay on top
} as const;

/**
 * Layer Constants for CSS-in-JS usage
 *
 * Usage in sx prop:
 *   <Box sx={{ zIndex: zIndex.appBar }}>...</Box>
 *
 * Usage in styled():
 *   const StyledComponent = styled(Box)(({ theme }) => ({
 *     zIndex: zIndex.modal,
 *   }));
 */

export type ZIndexKey = keyof typeof zIndex;

/**
 * Helper to validate z-index usage
 * Use this in tests to ensure no hardcoded z-index values are used
 */
export function isValidZIndexValue(value: number): boolean {
  return Object.values(zIndex).includes(value);
}

export default zIndex;

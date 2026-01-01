import { contentHandlers } from "./contentHandlers";
import { filesHandlers } from "./filesHandlers";
import { generationHandlers } from "./generationHandlers";
import { healthHandlers } from "./healthHandlers";
import { notificationsHandlers } from "./notificationsHandlers";
import { searchHandlers } from "./searchHandlers";
import { userHandlers } from "./userHandlers";
import { problemHandlers } from "./problemHandlers";
import { authHandlers } from "./authHandlers";

export const handlers = [
  ...authHandlers,
  ...healthHandlers,
  ...searchHandlers,
  ...notificationsHandlers,
  ...contentHandlers,
  ...generationHandlers,
  ...filesHandlers,
  ...userHandlers,
  ...problemHandlers,
];

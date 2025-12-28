// @ts-nocheck
import * as React from "react";



function Textarea({ cls, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      
      {...props}
    />
  );
}

export { Textarea };
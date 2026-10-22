import "react";
declare module "react" {
  interface FormHTMLAttributes<T> {
    toolname?: string;
    tooldescription?: string;
    toolautosubmit?: string;
  }
  interface HTMLAttributes<T> {
    toolparamdescription?: string;
  }
}

import type { ReactNode } from "react";
import {
  SystemNav,
  SystemProvider,
} from "@/components/product-system/SystemExperience";
import "./system.css";
import "./labs.css";
import "./overview.css";
import "./sections.css";
import "./workspace.css";
import "./build-demo.css";
import "./navigation.css";

export default function ProductSystemLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SystemProvider>
      <div className="product-system">
        <SystemNav />
        {children}
      </div>
    </SystemProvider>
  );
}

"use client";

import { BuildConversationDemo } from "@/components/product-system/BuildConversationDemo";
import { SystemProvider } from "@/components/product-system/SystemExperience";
import "@/app/product-system/build-demo.css";

export default function MethodBuildPreview({ paused }: { paused: boolean }) {
  return (
    <div className="clarity-build-preview">
      <SystemProvider>
        <BuildConversationDemo embedded paused={paused} />
      </SystemProvider>
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PrivateProductExample from "@/components/site/PrivateProductExample";
import { getProductEntry } from "@/content/portfolio";
const entry = getProductEntry("original-reader");
export const metadata: Metadata = {
  title: "Original Reader",
  description: entry?.description,
};
export default function Page() {
  if (!entry) notFound();
  return <PrivateProductExample entry={entry} />;
}

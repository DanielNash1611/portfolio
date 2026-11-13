import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PrivateProductExample from "@/components/site/PrivateProductExample";
import { getProductEntry } from "@/content/portfolio";
const entry = getProductEntry("temple-stories");
export const metadata: Metadata = {
  title: "Temple Stories",
  description: entry?.description,
};
export default function Page() {
  if (!entry) notFound();
  return <PrivateProductExample entry={entry} />;
}

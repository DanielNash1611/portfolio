import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Checkout Redesign",
  description:
    "How better execution turned a checkout redesign into measurable growth.",
};

export default function CheckoutRedesignPage(): never {
  redirect("/work/oms-transformation");
}

import type { Metadata } from "next";
import { KotaPage, kotaMetadata } from "@/components/kota/KotaPage";

export async function generateMetadata(): Promise<Metadata> {
  return kotaMetadata("wifi-sukoharjo");
}

export default function Page() {
  return <KotaPage slug="wifi-sukoharjo" />;
}

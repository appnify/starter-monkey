import { Page } from "@/utils/page";

const files = import.meta.glob("./*/index.tsx", { eager: true, import: "default" });
export const pages = Object.values(files) as Page[];

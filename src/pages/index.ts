import { Page } from "@/utils/page";

const files = import.meta.glob("./page-*.tsx", { eager: true, import: "default" });
export const pages = Object.values(files) as Page[];

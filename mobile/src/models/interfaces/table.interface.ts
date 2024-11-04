import { ReactNode } from "react";

export interface TableRow {
    id: number;
    values: ReactNode[];
    navigateTo: string;
    navigationAllowed?: boolean;
}

export interface TableCol {
    size: number;
    label: string;
}
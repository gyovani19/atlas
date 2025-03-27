import { Type } from "@angular/core";

export interface Widget{
    id: number;
    label: string;
    content: Type<unknown>;
    rows?: number;
    columns?: number;
    bgColor?: string;
    color?: string;
}
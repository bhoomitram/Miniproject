import { test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';


// Parse ITERATION environment variable
// Format: "1-3;5;7-9" means iterations 1,2,3,5,7,8,9 (1-based indexing)

export function parseIterations2(iterationStr?: string, records?: any[]): number[] {
  if (!iterationStr) {
    // If no iteration specified, run all
    return Array.from({ length: records?.length || 0 }, (_, i) => i);
  }

  const iterations = new Set<number>();
  const parts = iterationStr.split(';');

  parts.forEach((part) => {
    part = part.trim();
    if (part.includes('-')) {
      const [start, end] = part.split('-').map((s) => parseInt(s.trim(), 10));
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end; i++) {
          iterations.add(i - 1); // Convert to 0-based indexing
        }
      }
    } else {
      const num = parseInt(part, 10);
      if (!isNaN(num)) {
        iterations.add(num - 1); // Convert to 0-based indexing
      }
    }
  });

  return Array.from(iterations).sort((a, b) => a - b);
}
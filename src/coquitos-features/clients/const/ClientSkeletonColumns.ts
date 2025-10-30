import type { SkeletonColumn } from "@/shared/loaders-Skeleton";

export const clientSkeletonColumns: SkeletonColumn[] = [
  { width: 'w-32', lines: 2, avatar: true },  
  { width: 'w-20', lines: 1, type: 'badge' }, 
  { width: 'w-16', lines: 1, type: 'badge' }, 
  { width: 'w-24', lines: 1 },                 
  { width: 'w-auto', lines: 1, align: 'right', type: 'actions', count: 3 } 
];

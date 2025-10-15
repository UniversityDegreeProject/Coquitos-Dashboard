import type { SkeletonColumn } from "@/shared/loaders-Skeleton";

export const userTableSkeletonColumns:  SkeletonColumn[] = [
  { width: 'w-40', lines: 2, avatar: true },  
  { width: 'w-28', lines: 1, type: 'badge' }, 
  { width: 'w-20', lines: 1, type: 'badge' }, 
  { width: 'w-32', lines: 1 },                 
  { width: 'w-auto', lines: 1, align: 'right', type: 'actions', count: 5 } 
];

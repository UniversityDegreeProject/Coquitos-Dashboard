import { Suspense, type ReactNode } from "react";

interface SuspenseWrapperProps {
  children: ReactNode;
}

export const SuspenseWrapper = ({ children }: SuspenseWrapperProps) => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-[#F59E0B] rounded-full animate-spin" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
};

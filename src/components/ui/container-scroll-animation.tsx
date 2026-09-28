import type { ReactNode } from "react";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | ReactNode;
  children: ReactNode;
}) => {
  return (
    <div className="flex items-center justify-center relative px-4 md:px-12 py-10 md:py-16 overflow-hidden">
      <div className="py-6 md:py-10 w-full relative max-w-6xl mx-auto">
        <div className="max-w-6xl mx-auto text-center">{titleComponent}</div>
        <div className="max-w-6xl mt-8 md:mt-10 mx-auto w-full border border-[var(--border)] p-2 md:p-3 bg-[var(--surface)] rounded-[var(--radius-lg)]">
          <div className="h-full w-full overflow-hidden rounded-[var(--radius-md)] bg-[var(--bg)] border border-[var(--border)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Header = ({
  titleComponent,
}: {
  titleComponent: ReactNode;
}) => {
  return (
    <div className="max-w-6xl mx-auto text-center">{titleComponent}</div>
  );
};

export const Card = ({ children }: { children: ReactNode }) => {
  return (
    <div className="max-w-6xl mx-auto w-full border border-[var(--border)] p-2 md:p-4 bg-[var(--surface)] rounded-[var(--radius-lg)]">
      <div className="h-full w-full overflow-hidden rounded-[var(--radius-md)] bg-[var(--bg)] border border-[var(--border)]">
        {children}
      </div>
    </div>
  );
};

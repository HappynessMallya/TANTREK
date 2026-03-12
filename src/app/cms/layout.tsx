import { CmsShell } from "./CmsShell";
import { CmsAuthGuard } from "./CmsAuthGuard";

export const metadata = {
  title: "CMS | Tanzania Wildmakers Safaris",
  robots: "noindex, nofollow",
};

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <CmsAuthGuard Shell={CmsShell}>
      {children}
    </CmsAuthGuard>
  );
}

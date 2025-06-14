import SessionChecker from "@/components/auth/SessionChecker";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionChecker>{children}</SessionChecker>;
}

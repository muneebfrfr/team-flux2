// src/app/profile/layout.tsx

export const metadata = {
  title: "Profile | Team Flux",
};
export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

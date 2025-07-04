// app/login/layout.tsx
export const metadata = {
  title: 'SignUp | Team Flux',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <section style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      {children}
    </section>
  );
}

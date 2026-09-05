import Navbar from "../components/layout/header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar mode="dashboard" />
      {children}
    </>
  );
}
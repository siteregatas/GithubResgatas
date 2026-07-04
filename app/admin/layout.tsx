import "./admin.css";

export const metadata = {
  title: "Admin — ResGatas",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}

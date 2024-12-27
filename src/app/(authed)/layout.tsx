import Header from "@/components/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto max-w-[800px] min-w-[800px] gap-4 flex flex-col">
      <Header />
      {children}
    </div>
  );
}

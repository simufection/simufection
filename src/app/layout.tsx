import "@/styles/style.scss";
export const metadata = {
  title: "Simufection",
  description: "simulator of infection",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/destyle.css@1.0.15/destyle.css"
        />
      </head>
      <body>
        <div className="l-main">
          <div className="l-header"></div>
          {children}
          <div className="l-footer"></div>
        </div>
      </body>
    </html>
  );
}

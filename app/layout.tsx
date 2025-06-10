import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import { Room } from "./Room";
import "./globals.css";
const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight:['400','600','700']
});


export const metadata: Metadata = {
  title: "WrapBoard",
  description: "A designing tool and whiteboard with real-time collaboration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${workSans.className} bg-primary-grey-200 antialiased`}>
          <Room>

        {children}
          </Room>
      </body>
    </html>
  );
}

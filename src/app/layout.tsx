import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: '스콘 생산량 관리 시스템 (Next.js + Supabase)',
  description: 'Supabase PostgreSQL DB 연동 기반 실시간 스콘 생산량 및 오븐 배치 자동화 시스템',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

import { Sidebar } from '@/components/layout/Sidebar';
import { FormArea } from '@/components/layout/FormArea';
import { PreviewPanel } from '@/components/layout/PreviewPanel';
import { ExportConsole } from '@/components/layout/ExportConsole';
import { LanguageSelector } from '@/components/LanguageSelector';

export default function Home() {
  return (
    <div className="flex flex-col h-screen overflow-hidden text-white relative">
      <LanguageSelector />
      {/* 3-Column Grid for main workspace */}
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        <Sidebar />
        <FormArea />
        <PreviewPanel />
      </div>

      {/* Sticky Bottom Bar */}
      <ExportConsole />
    </div>
  );
}

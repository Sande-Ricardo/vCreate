import { CvPreview } from '@/components/preview/CvPreview';

export function PreviewPanel() {
  return (
    <aside className="hidden lg:flex flex-col lg:w-80 xl:w-96 shrink-0 border-l border-[rgba(229,229,229,0.1)] p-6 bg-[rgba(255,255,255,0.01)] backdrop-blur-md">
      <h2 className="type-title-md mb-6 shrink-0">Live Preview</h2>
      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0">
          <CvPreview />
        </div>
      </div>
    </aside>
  );
}

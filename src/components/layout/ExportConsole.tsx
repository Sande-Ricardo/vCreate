import { Button } from '@/components/ui';

export function ExportConsole() {
  return (
    <div className="w-full border-t border-[rgba(229,229,229,0.1)] bg-[#131313] p-4 flex items-center justify-between sticky bottom-0 z-10">
      <div className="type-body-md text-[var(--color-on-surface-variant)]">Ready to export.</div>
      <div className="flex gap-4">
        <Button variant="secondary" size="sm">Save JSON</Button>
        <Button variant="primary" size="sm">Export PDF</Button>
      </div>
    </div>
  );
}

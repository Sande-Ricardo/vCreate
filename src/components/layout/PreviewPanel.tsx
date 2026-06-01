export function PreviewPanel() {
  return (
    <aside className="hidden lg:block lg:w-80 xl:w-96 shrink-0 border-l border-[rgba(229,229,229,0.1)] p-6 bg-[rgba(255,255,255,0.01)] backdrop-blur-md">
      <h2 className="type-title-md mb-6">Live Preview</h2>
      <div className="aspect-[1/1.414] bg-white w-full shadow-lg" />
    </aside>
  );
}

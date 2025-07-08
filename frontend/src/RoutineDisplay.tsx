function parseMarkdown(text: string) {
  if (!text) return "";
  return (
    text
      // Headers
      .replace(
        /^### (.*$)/gm,
        '<h3 class="text-xl font-semibold text-amber-400 mt-6 mb-3">$1</h3>'
      )
      .replace(
        /^## (.*$)/gm,
        '<h2 class="text-2xl font-bold text-amber-300 mt-8 mb-4">$1</h2>'
      )
      .replace(
        /^# (.*$)/gm,
        '<h1 class="text-3xl font-bold text-amber-200 mt-10 mb-6">$1</h1>'
      )
      // Bold text
      .replace(
        /\*\*\*(.*?)\*\*\*/g,
        '<strong class="text-amber-300 font-semibold">$1</strong>'
      )
      .replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="text-amber-400 font-semibold">$1</strong>'
      )
      // Italic text
      .replace(/\*(.*?)\*/g, '<em class="text-gray-300 italic">$1</em>')
      // Convert bullet points
      .replace(/^\* (.*$)/gm, '<li class="ml-4 mb-2 text-gray-200">• $1</li>')
      // Convert line breaks
      .replace(/\n/g, "<br/>")
      // Wrap consecutive <li> elements in <ul>
      .replace(/(<li[^>]*>.*?<\/li>)(<br\/>)*(?=<li|$)/g, "$1")
      .replace(/(<li[^>]*>.*?<\/li>)+/g, '<ul class="mb-4">$&</ul>')
      // Clean up extra breaks
      .replace(/<br\/><br\/>/g, '<br class="mb-4"/>')
  );
}

interface RoutineDisplayProps {
  routine: string | null;
  onBack: () => void;
}

export default function RoutineDisplay({
  routine,
  onBack,
}: RoutineDisplayProps) {
  if (!routine) return null;

  const htmlContent = parseMarkdown(routine);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="bg-gray-900 px-6 py-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-amber-400">
            Your Practice Routine
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>

        {/* Footer */}
        <div className="bg-gray-900 px-6 py-4 border-t border-gray-700 flex justify-center">
          <button
            onClick={onBack}
            className="px-6 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

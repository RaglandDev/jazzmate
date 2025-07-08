interface CreateRoutineButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

const CreateRoutineButton = ({
  onClick,
  isLoading = false,
}: CreateRoutineButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`
        mt-16 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200
        ${
          isLoading
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-amber-600 hover:bg-amber-700 active:scale-95"
        }
        text-white flex items-center gap-3
      `}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Generating routine...
        </>
      ) : (
        "Generate Practice Routine"
      )}
    </button>
  );
};

export default CreateRoutineButton;

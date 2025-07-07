import React from 'react';

interface Props {
  onClick: () => void;
}

const CreateRoutineButton: React.FC<Props> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="mt-8 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
    >
      Create Routine
    </button>
  );
};

export default CreateRoutineButton;

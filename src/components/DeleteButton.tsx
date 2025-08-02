import { useState } from 'react';
import { Trash2, RotateCcw } from 'lucide-react';

interface DeleteButtonProps {
  characterId: number;
  isDeleted: boolean;
  onToggle: (id: number) => void;
}

export function DeleteButton({ characterId, isDeleted, onToggle }: DeleteButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isDeleted) {
      setShowConfirm(true);
    } else {
      onToggle(characterId);
    }
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle(characterId);
    setShowConfirm(false);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(false);
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={`p-1 rounded-full bg-gray-100 transition-colors ${isDeleted ? 'text-primary-600 hover:bg-gray-100' : 'text-gray-400 hover:bg-gray-100'}`}
        aria-label={isDeleted ? 'Restore character' : 'Delete character'}
      >
        {isDeleted ? (
          <RotateCcw className="w-5 h-5" />
        ) : (
          <Trash2 className="w-5 h-5" />
        )}
      </button>

      {showConfirm && (
        <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 w-64">
          <p className="text-sm text-gray-600 mb-4">Are you sure you want to delete this character?</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel  
            </button>
            <button
              onClick={handleConfirm}
              className="px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            >
              Delete  
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
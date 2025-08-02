export default function DefaultCharacterView() {
  return (
    <div className="flex items-center justify-center h-full p-8">
      <div className="text-center text-gray-500">
        <div className="mb-4">
          <svg 
            className="w-16 h-16 mx-auto text-gray-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1} 
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Select a character
        </h3>
        <p className="text-sm text-gray-500">
          Click on any character in the list to view their details.
        </p>
      </div>
    </div>
  );
}
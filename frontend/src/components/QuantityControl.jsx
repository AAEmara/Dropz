export default function QuantityControl({
  onAddClick,
  onMinusClick,
  itemCount,
  disableMinus,
  disablePlus,
  errorMessage
}) {
  return (

    <div className="flex flex-col items-center space-y-1">
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={onMinusClick}
          disabled={disableMinus}
          className={`cursor-pointer px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition ${
            disableMinus ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          −
        </button>
        <span className="cursor-pointer px-4 py-1 bg-white border rounded text-gray-800">
          {itemCount}
        </span>
        <button
          type="button"
          onClick={onAddClick}
          disabled={disablePlus}
          className={`cursor-pointer px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition ${
            disablePlus ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          +
        </button>
      </div>

      
      {errorMessage && (
        <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
      )}

    </div>
  );
}

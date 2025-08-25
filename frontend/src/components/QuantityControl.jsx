export default function QuantityControl({ onAddClick, onMinusClick, itemCount }) {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={onMinusClick}
        className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
      >
        −
      </button>
      <span className="px-4 py-1 bg-white border rounded text-gray-800">{itemCount}</span>
      <button
        onClick={onAddClick}
        className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
      >
        +
      </button>
    </div>
  );
}
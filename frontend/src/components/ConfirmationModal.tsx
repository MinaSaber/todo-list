export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm bg-opacity-50 z-50 animate-fadeIn">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 transform transition-transform duration-300 scale-90 hover:scale-100">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Are you sure you want to delete this task?
        </h3>
        <div className="flex justify-between gap-4">
          <button
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition duration-200"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200 hover:bg-red-700"
            onClick={onConfirm}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

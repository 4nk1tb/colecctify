import React from 'react';
import { Dialog, GlassButton } from './UI';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-300 bg-gray-200/50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-300/50 dark:hover:bg-gray-600/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900 focus:ring-gray-500 transition-colors duration-200"
          >
            Cancel
          </button>
          <GlassButton
            onClick={() => {
              onConfirm();
            }}
            className="!bg-red-500/80 hover:!bg-red-600/80 focus:!ring-red-500"
          >
            Delete
          </GlassButton>
        </div>
      </div>
    </Dialog>
  );
};
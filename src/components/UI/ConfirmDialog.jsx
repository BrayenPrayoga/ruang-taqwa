'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, X } from 'lucide-react';

/**
 * ConfirmDialog - Custom confirmation dialog yang lebih menarik
 * Menggantikan window.confirm() dengan UI yang modern
 */
const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Konfirmasi Hapus", 
  message = "Apakah Anda yakin ingin menghapus item ini?",
  confirmText = "Hapus",
  cancelText = "Batal"
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className='fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999]'
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className='fixed inset-0 z-[10000] flex items-center justify-center p-4'
          >
            <div 
              className='bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden'
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className='flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800'>
                <div className='flex items-center gap-3'>
                  <div className='w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center'>
                    <Trash2 size={20} className='text-red-600 dark:text-red-400' />
                  </div>
                  <div>
                    <h3 className='text-lg font-bold text-slate-800 dark:text-slate-100'>
                      {title}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className='p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors'
                >
                  <X size={16} />
                </button>
              </div>

              {/* Content */}
              <div className='p-6'>
                <p className='text-slate-600 dark:text-slate-400 leading-relaxed'>
                  {message}
                </p>
              </div>

              {/* Footer */}
              <div className='flex gap-3 p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50'>
                <button
                  onClick={onClose}
                  className='flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors'
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className='flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors'
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;

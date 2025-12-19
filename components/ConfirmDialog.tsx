/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'CONFIRM',
  cancelText = 'CANCEL',
  onConfirm,
  onCancel,
  variant = 'warning'
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={onCancel}
      />

      {/* Dialog */}
      <div
        className="position-fixed top-50 start-50 translate-middle bg-white border border-dark p-4"
        style={{
          zIndex: 10000,
          maxWidth: '400px',
          width: '90%',
          borderWidth: '2px',
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        {/* Logo */}
        <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
          <div className="bg-dark d-flex align-items-center justify-content-center"
               style={{ width: '32px', height: '32px' }}>
            <span className="fw-black text-white" style={{ fontSize: '16px' }}>P</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="fw-bold text-center text-dark mb-3 text-uppercase" style={{ letterSpacing: '0.1em', fontSize: '1.25rem' }}>
          {title}
        </h3>

        {/* Message */}
        <p className="text-dark text-center mb-4" style={{ opacity: 0.7, letterSpacing: '0.05em', lineHeight: 1.6 }}>
          {message}
        </p>

        {/* Actions */}
        <div className="d-flex flex-column gap-2">
          <button
            onClick={onConfirm}
            className={`btn text-white fw-bold text-uppercase w-100 ${
              variant === 'danger' ? 'bg-danger' : 'bg-dark'
            }`}
            style={{
              fontSize: '0.875rem',
              letterSpacing: '0.1em',
              padding: '0.75rem',
              borderRadius: 0
            }}
          >
            {confirmText}
          </button>
          <button
            onClick={onCancel}
            className="btn border border-dark text-dark fw-bold text-uppercase w-100"
            style={{
              fontSize: '0.875rem',
              letterSpacing: '0.1em',
              padding: '0.75rem',
              backgroundColor: 'transparent',
              borderRadius: 0
            }}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </>
  );
};

export default ConfirmDialog;

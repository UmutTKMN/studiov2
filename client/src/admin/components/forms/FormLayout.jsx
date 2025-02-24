import React from 'react';
import { ArrowLeft } from 'iconoir-react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

export const FormLayout = ({ 
  title, 
  subtitle,
  children, 
  loading, 
  error,
  actions 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="text"
                color="primary"
                size="md"
                icon={ArrowLeft}
                onClick={() => navigate(-1)}
              >
                Geri Dön
              </Button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                {subtitle && (
                  <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 overflow-hidden">
            <div className="p-6">
              {error && (
                <div className="mb-6 rounded-lg bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  children
                )}
              </div>
            </div>

            {/* Actions */}
            {actions && (
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3">
                {actions}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
import { useState, useEffect } from "react";

function ServerError({ onRetry, errorDetails = null }) {
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      onRetry();
    }
  }, [countdown, onRetry]);

  return (
    <div className="bg-orange-50 border border-orange-200 p-6 rounded-lg shadow-lg text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-16 w-16 text-orange-500 mx-auto mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>

      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Sunucuya Ulaşılamıyor
      </h2>
      <p className="text-gray-700 mb-4">
        Sunucuya erişim sırasında bir hata oluştu. Lütfen internet bağlantınızı
        kontrol edin veya daha sonra tekrar deneyin.
      </p>

      {errorDetails && (
        <div className="text-left bg-orange-100 p-3 rounded-md mb-4 text-sm text-orange-800 font-mono">
          <p className="font-bold">Hata detayı:</p>
          <p>{errorDetails}</p>
        </div>
      )}

      <div className="mt-6 space-x-4">
        <button
          onClick={onRetry}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md font-medium"
        >
          Şimdi Tekrar Dene
        </button>

        <div className="mt-4 text-sm text-gray-600">
          {countdown > 0 ? (
            <p>{countdown} saniye içinde otomatik olarak tekrar denenecek...</p>
          ) : (
            <p>Yeniden bağlanılıyor...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ServerError;

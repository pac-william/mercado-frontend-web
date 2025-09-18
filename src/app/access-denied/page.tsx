import Link from 'next/link';

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
        <div className="text-red-500 text-6xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Acesso Negado
        </h1>
        <p className="text-gray-600 mb-6">
          Você não tem permissão para acessar esta página.
        </p>
        <Link 
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Voltar ao Início
        </Link>
      </div>
    </div>
  );
}

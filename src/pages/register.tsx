import Link from 'next/link';
import Head from 'next/head';
import { FiClock } from 'react-icons/fi';

export default function RegisterPage() {
  return (
    <>
      <Head>
        <title>Coming Soon | CRM Dashboard</title>
      </Head>
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <img src="/images/crm.jpg" alt="CRM" className="h-20 w-auto mx-auto mb-6" />
          
          <div className="card p-8">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-primary-100 rounded-full">
                <FiClock className="h-12 w-12 text-primary-600" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              Coming Soon
            </h1>
            
            <p className="text-secondary-600 mb-6">
              Registration feature is currently under development. Please check back later.
            </p>
            
            <Link 
              href="/login" 
              className="btn-primary w-full py-3 inline-block"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

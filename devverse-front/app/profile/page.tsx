'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Github } from 'lucide-react';
import Card from '../components/ui/Card';
import Container from '../components/ui/Container';

export default function ProfilePage() {
  const { data: session, status } = useSession();

  console.log(session);


  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Container className="py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center mt-4 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </button>


          </div>

          {/* User Profile Card */}
          <Card variant="elevated" className="mb-8">
            <div className="flex items-center space-x-6 mb-6">
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                />
              )}

              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {session.user?.name || 'Unknown User'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  @{session.user?.username || 'username'}
                </p>

                {session.user?.githubProfile && (
                  <a
                    href={session.user.githubProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-2 text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors"
                  >
                    <Github className="h-4 w-4 mr-1" />
                    View GitHub Profile
                  </a>
                )}
              </div>
            </div>
          </Card>

        </div>
      </Container>
    </div>
  );
}

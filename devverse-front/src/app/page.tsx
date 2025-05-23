'use client';

import { useRouter } from 'next/navigation';
import { Code, Users, Share2, Zap, CheckCircle } from 'lucide-react';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import Container from '@/app/components/ui/Container';
import { useAuthStore } from '@/stores';

export default function Home() {
  const router = useRouter();

  const { isAuthenticated } = useAuthStore();

  const onLogin = () => router.push('/login');
  const onRegister = () => router.push('/register');

  const features = [
    {
      icon: Code,
      title: 'Showcase Your Code',
      description: 'Build a portfolio that highlights your best projects, skills, and contributions to open source.'
    },
    {
      icon: Users,
      title: 'Connect with Developers',
      description: 'Network with like-minded developers, collaborate on projects, and grow your professional circle.'
    },
    {
      icon: Share2,
      title: 'Share Knowledge',
      description: 'Publish articles, tutorials, and insights about your tech stack and development experiences.'
    },
    {
      icon: Zap,
      title: 'Stay Updated',
      description: 'Keep up with the latest technologies, tools, and best practices in software development.'
    }
  ];

  const benefits = [
    'Personalized developer profile',
    'Project portfolio showcase',
    'Technical blog platform',
    'Developer community access',
    'Job opportunity connections',
    'Skill endorsement system'
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-indigo-50 to-white dark:from-gray-800 dark:to-gray-900">
        <Container>
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
                Connect, Share, and Grow as a{" "}
                <span className="text-indigo-600 dark:text-indigo-400">Developer</span>
              </h1>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                A minimalist platform where developers can showcase their expertise,
                build meaningful connections, and share valuable content with the community.
              </p>
              <div className={`${isAuthenticated ? 'hidden' : 'flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4'}`}>
                <Button size="lg" onClick={onRegister}>
                  Get Started
                </Button>
                <Button size="lg" variant="outline" onClick={onLogin}>
                  Log In
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 lg:pl-12">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 transform transition-transform hover:scale-105">
                <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="w-3/4 h-6 bg-gray-200 dark:bg-gray-700 rounded mt-6 animate-pulse"></div>
                <div className="w-1/2 h-4 bg-gray-200 dark:bg-gray-700 rounded mt-4 animate-pulse"></div>
                <div className="flex mt-6 space-x-2">
                  <div className="w-20 h-8 bg-indigo-200 dark:bg-indigo-900 rounded animate-pulse"></div>
                  <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-16" id="features">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our platform provides all the essential tools developers need to showcase their work,
              connect with others, and grow their careers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                variant="elevated"
                className="transform transition-all hover:translate-y-[-4px] hover:shadow-lg"
              >
                <div className="p-2 w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <Container>
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Why Join Our Developer Community?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                We&apos;ve designed a platform specifically for developers with the features you actually need,
                without the clutter and noise of generic social networks.
              </p>

              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>

              <Button className={`${isAuthenticated ? 'hidden' : 'mt-8'}`} onClick={onRegister}>
                Join Now
              </Button>
            </div>

            <div className="lg:w-1/2 lg:pl-12">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 h-40 transform transition-transform hover:scale-105"></div>
                <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 h-40 transform transition-transform hover:scale-105 translate-y-4"></div>
                <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 h-40 transform transition-transform hover:scale-105 translate-y-[-16px]"></div>
                <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 h-40 transform transition-transform hover:scale-105"></div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className={`${isAuthenticated ? 'hidden' : 'py-16 bg-indigo-600 dark:bg-indigo-900'}`} >
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Join Our Developer Community?
            </h2>
            <p className="text-indigo-100 max-w-2xl mx-auto mb-8">
              Create your developer profile today and start connecting with other professionals in your field.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-indigo-600"
                size="lg"
                onClick={onRegister}
              >
                Sign Up Now
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={onLogin}
              >
                Log In
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
export default function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Skeleton Card 1 - Total Projects */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md animate-pulse">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-gray-200 dark:bg-gray-700">
            <div className="h-6 w-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
          <div className="ml-4 flex-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
          </div>
        </div>
      </div>

      {/* Skeleton Card 2 - Total Stars */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md animate-pulse">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-gray-200 dark:bg-gray-700">
            <div className="h-6 w-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
          <div className="ml-4 flex-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
          </div>
        </div>
      </div>

      {/* Skeleton Card 3 - Total Commits */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md animate-pulse">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-gray-200 dark:bg-gray-700">
            <div className="h-6 w-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
          <div className="ml-4 flex-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28 mb-2"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
          </div>
        </div>
      </div>

      {/* Skeleton Card 4 - Active Projects */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md animate-pulse">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-gray-200 dark:bg-gray-700">
            <div className="h-6 w-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
          <div className="ml-4 flex-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
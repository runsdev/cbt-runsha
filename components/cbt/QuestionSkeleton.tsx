import React from "react";

const QuestionSkeleton = () => {
  return (
    <div className="w-full py-8 bg-gradient-to-b from-secondary/20 to-background/95 min-h-screen mx-auto">
      {/* Main Quiz Container */}
      <div className="w-full max-w-[90%] mx-auto rounded-xl overflow-hidden shadow-lg">
        {/* Timer and Navigation Block Skeleton */}
        <div className="bg-gradient-to-r from-background to-background/95 p-5 rounded-t-xl border-b border-border/30">
          <div className="flex justify-between items-center">
            <div className="h-6 w-48 bg-muted animate-pulse rounded-full flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-primary/30 animate-pulse" />
              <div className="flex-1" />
            </div>
            <div className="h-6 w-40 bg-muted animate-pulse rounded-full" />
          </div>
        </div>

        {/* Main Content with Sidebar Layout */}
        <div className="flex flex-col md:flex-row">
          {/* Question Navigation - Left Sidebar */}
          <div className="w-full md:w-[20%] bg-background/95 p-4 border-r border-border/30">
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {[...Array(20)].map((_, index) => (
                <div
                  key={index}
                  className="w-full aspect-square p-3 rounded-lg border border-border/50 bg-background animate-pulse relative"
                >
                  <div className="h-5 w-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Question Content Skeleton */}
          <div className="w-full md:w-[80%] bg-gradient-to-b from-background to-background/98 p-6 sm:p-8 rounded-b-xl shadow-inner">
            {/* Question Title Skeleton */}
            <div className="flex justify-between items-center mb-6">
              <div className="h-8 w-48 bg-muted animate-pulse rounded flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-primary/30 animate-pulse" />
                <div className="flex-1" />
              </div>
              <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
            </div>

            {/* Question Text Skeleton */}
            <div className="max-w-none mb-8 bg-card/50 p-6 rounded-lg border border-border/30 shadow-sm">
              <div className="space-y-3">
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
                <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
              </div>
            </div>

            {/* Answer Options Skeleton */}
            <div className="space-y-3 mt-6">
              <div className="bg-card/50 p-3 rounded-lg border border-border/30">
                {/* Short answer skeleton */}
                <div className="flex gap-2 mb-4">
                  <div className="w-full h-12 bg-muted animate-pulse rounded-lg" />
                  <div className="h-12 w-24 bg-muted animate-pulse rounded-lg" />
                </div>

                {/* Multiple choice skeleton */}
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-4 rounded-lg mb-2 last:mb-0 border border-transparent"
                  >
                    <div className="flex-shrink-0 w-5 h-5 border-2 rounded-full bg-muted animate-pulse" />
                    <div className="h-4 w-full bg-muted animate-pulse rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons Skeleton */}
            <div className="mt-8 flex justify-between">
              <div className="px-6 py-3 bg-muted animate-pulse rounded-lg h-12 w-32" />
              <div className="px-6 py-3 bg-muted animate-pulse rounded-lg h-12 w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionSkeleton;

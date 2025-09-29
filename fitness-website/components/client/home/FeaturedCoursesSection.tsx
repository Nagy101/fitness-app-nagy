"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CardSkeleton, SectionWrapper, SectionHeader, PrimaryButton } from "@/components/common";
import { ProtectedAction } from "@/components/auth/Protected-Route";
import { getProxyImageUrl } from "@/lib/images";
import { formatNumber } from "@/utils/format";
import type { FeaturedCoursesSectionProps } from "@/types/home";

import { Play, ArrowRight } from "lucide-react";

const FeaturedCoursesSection = React.memo<FeaturedCoursesSectionProps>(({ 
  courses, 
  isLoading, 
  onEnrollment 
}) => {
  // Resolve best image URL for course with safe fallbacks (use proxy URL)
  const resolveCourseImage = (course: any): string => {
    const raw = course?.image || course?.image_url || course?.main_image_url || "";
    return raw ? getProxyImageUrl(raw) : "/placeholder.svg";
  };

  return (
    <SectionWrapper backgroundColor="gray">
      <SectionHeader 
        title="Featured Courses"
        description="Expert-led fitness courses and training programs designed for all skill levels"
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          // Loading skeletons using shared component
          Array(3).fill(0).map((_, index) => (
            <CardSkeleton key={`skeleton-${index}`} />
          ))
          ) : courses.length > 0 ? (
            courses.map((course, index) => (
              <Card
                key={`${course.id}-${index}`}
                className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white"
              >
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      unoptimized
                      src={resolveCourseImage(course)}
                      alt={course.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        // Prevent infinite loop if placeholder also fails
                        img.onerror = null;
                        img.src = "/placeholder.svg";
                        const originalUrl = resolveCourseImage(course);
                        if (originalUrl !== "/placeholder.svg" && process.env.NODE_ENV !== 'production') {
                          console.info("[images] Course image failed, swapped to placeholder:", originalUrl);
                        }
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <Badge style={{ backgroundColor: "#32CD32", color: "#FFFFFF" }}>
                        {course.category}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="outline" className="bg-white">
                        {course.rating && course.rating > 0 ? `${course.rating} ★` : "New"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-xl mb-2" style={{ color: "#212529" }}>
                    {course.title}
                  </CardTitle>
                  <CardDescription className="mb-4" style={{ color: "#6C757D" }}>
                    by {course.instructor} • {formatNumber(course.students || 0)} students
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold" style={{ color: "#007BFF" }}>
                      {formatNumber(course.price)} EGP
                    </span>
                    <ProtectedAction onAction={() => onEnrollment(course)}>
                      <PrimaryButton>
                        <Play className="h-4 w-4 mr-2" />
                        Enroll Now
                      </PrimaryButton>
                    </ProtectedAction>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-8">
              <p className="text-gray-500">No featured courses available at the moment.</p>
            </div>
          )}
      </div>

      <div className="text-center mt-12">
        <PrimaryButton asChild variant="outline" size="lg">
          <Link href="/courses" className="inline-flex items-center gap-2">
            View All Courses
            <ArrowRight className="h-5 w-5" />
          </Link>
        </PrimaryButton>
      </div>
    </SectionWrapper>
  );
});

FeaturedCoursesSection.displayName = "FeaturedCoursesSection";

export default FeaturedCoursesSection;

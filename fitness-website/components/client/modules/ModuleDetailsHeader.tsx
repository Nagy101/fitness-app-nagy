"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Clock, 
  Play, 
  Calendar,
  Target,
  Users
} from "lucide-react";

interface Module {
  module_id: number;
  course_id: number;
  title: string;
  description: string;
  order_number: number;
  created_at: string;
  chapters?: any[];
}

interface ModuleDetailsHeaderProps {
  module: Module;
}

const ModuleDetailsHeader = React.memo<ModuleDetailsHeaderProps>(({ module }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateDuration = () => {
    const chaptersCount = module.chapters?.length || 0;
    const totalMinutes = chaptersCount * 15; // Assume 15 min per chapter
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 rounded-xl p-8 mb-8 border border-gray-100"
    >
      <div className="max-w-4xl">
        {/* Module Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-2 mb-4"
        >
          <Badge variant="secondary" className="bg-primary/10 text-primary font-medium">
            <BookOpen className="w-3 h-3 mr-1" />
            Module {module.order_number}
          </Badge>
          <Badge variant="outline" className="border-gray-200">
            {module.chapters?.length || 0} Chapters
          </Badge>
        </motion.div>

        {/* Module Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
        >
          {module.title}
        </motion.h1>

        {/* Module Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg text-muted-foreground mb-8 leading-relaxed"
        >
          {module.description}
        </motion.p>

        {/* Module Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Play className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Chapters</p>
              <p className="font-semibold">{module.chapters?.length || 0}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-semibold">{calculateDuration()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Difficulty</p>
              <p className="font-semibold">Intermediate</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="font-semibold">{formatDate(module.created_at)}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
});

ModuleDetailsHeader.displayName = "ModuleDetailsHeader";

export default ModuleDetailsHeader;

import { memo } from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export const DashboardSkeleton = memo(() => {
  return (
    <motion.div 
      className="space-y-4" 
      aria-busy="true" 
      aria-label="Loading dashboard"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} className="skeleton h-24 w-full rounded-2xl" />

      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
        <div className="skeleton h-24 w-full rounded-2xl" />
        <div className="skeleton h-24 w-full rounded-2xl" />
        <div className="skeleton h-24 w-full rounded-2xl" />
        <div className="skeleton h-24 w-full rounded-2xl" />
        <div className="skeleton h-20 w-full col-span-2 rounded-2xl" />
      </motion.div>

      <motion.div variants={itemVariants} className="skeleton h-14 w-full rounded-xl" />

      <motion.div variants={itemVariants} className="skeleton h-28 w-full rounded-2xl" />
      <motion.div variants={itemVariants} className="skeleton h-28 w-full rounded-2xl" />
      <motion.div variants={itemVariants} className="skeleton h-28 w-full rounded-2xl" />
      <motion.div variants={itemVariants} className="skeleton h-28 w-full rounded-2xl" />
    </motion.div>
  );
});

DashboardSkeleton.displayName = 'DashboardSkeleton';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTimerStore } from '@/store/timerStore';
import { TrendingUp, Target, Calendar, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import type React from 'react';

interface StatsPanelProps {
  className?: string;
}

interface StatCard {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
}

export function StatsPanel({ className = '' }: StatsPanelProps) {
  const { stats, completedPomodoros } = useTimerStore();

  const statCards: StatCard[] = [
    {
      title: 'Today',
      value: stats.todayPomodoros,
      icon: Target,
      color: 'text-duck-yellow',
      description: 'Pomodoros completed today',
    },
    {
      title: 'Session',
      value: completedPomodoros,
      icon: TrendingUp,
      color: 'text-duck-blue',
      description: 'In current session',
    },
    {
      title: 'Total',
      value: stats.totalPomodoros,
      icon: Calendar,
      color: 'text-duck-green',
      description: 'All time pomodoros',
    },
    {
      title: 'Streak',
      value: stats.streakDays,
      icon: Trophy,
      color: 'text-duck-orange',
      description: 'Days in a row',
    },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-center">Your Progress</h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="text-center hover:shadow-soft transition-shadow duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-center mb-1">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <CardTitle className="text-2xl font-bold">
                  {stat.value}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-xs">
                  {stat.description}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Motivational message */}
      {stats.todayPomodoros > 0 && (
        <motion.div
          className="text-center p-3 bg-gradient-duck rounded-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm font-medium text-foreground">
            🎉 Great job! You've completed {stats.todayPomodoros} pomodoro{stats.todayPomodoros > 1 ? 's' : ''} today!
          </p>
        </motion.div>
      )}
    </div>
  );
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTimerStore } from '@/store/timerStore';
import { TrendingUp, Target, Calendar, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface StatsPanelProps {
  className?: string;
}

export function StatsPanel({ className = '' }: StatsPanelProps) {
  const { t } = useTranslation();
  const { stats, completedPomodoros } = useTimerStore();

  const statCards = [
    {
      title: t('stats.today'),
      value: stats.todayPomodoros,
      icon: Target,
      color: 'text-duck-yellow',
      description: t('stats.todayDescription'),
    },
    {
      title: t('stats.session'),
      value: completedPomodoros,
      icon: TrendingUp,
      color: 'text-duck-blue',
      description: t('stats.sessionDescription'),
    },
    {
      title: t('stats.total'),
      value: stats.totalPomodoros,
      icon: Calendar,
      color: 'text-duck-green',
      description: t('stats.totalDescription'),
    },
    {
      title: t('stats.streak'),
      value: stats.streakDays,
      icon: Trophy,
      color: 'text-duck-orange',
      description: t('stats.streakDescription'),
    },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-center">{t('stats.yourProgress')}</h3>
      
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
            {t('stats.congrats', { count: stats.todayPomodoros })}
          </p>
        </motion.div>
      )}
    </div>
  );
}
import { Card, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { MessageSquare, CalendarPlus, LogOut, Play } from 'lucide-react';

export const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* User Profile Card */}
      <div className="bg-forest-700 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-rose-300 text-forest-900 flex items-center justify-center font-bold text-lg shrink-0">
            SB
          </div>
          <div>
            <h2 className="text-xl font-bold">Shanti Biswas</h2>
            <p className="text-cream-200 text-sm">sb3547@srmist.edu.in · Intern</p>
            <p className="text-cream-300 text-xs">6 month</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 bg-forest-600/30 rounded-xl p-4">
          <div className="text-center">
            <p className="text-2xl font-bold">2</p>
            <p className="text-xs text-cream-200">Ongoing Projects</p>
          </div>
          <div className="text-center border-x border-cream-200/20">
            <p className="text-2xl font-bold">1 week</p>
            <p className="text-xs text-cream-200">Duration</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-cream-200">Meetings Today</p>
          </div>
        </div>
      </div>

      {/* Greeting */}
      <div>
        <p className="text-forest-500 text-base">Good Morning, Shanti 👋</p>
        <h2 className="text-xl font-bold text-forest-900">Let's see what do we have to do today!</h2>
      </div>

      {/* Today's Schedule + Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Today's Schedule */}
        <Card variant="olive" className="p-5">
          <CardTitle className="text-forest-900 mb-4 text-base">Today's Schedule</CardTitle>
          <CardContent>
            <div className="space-y-3 text-sm">
              {[
                { time: '10:30 AM', task: 'Peer review and design discussion' },
                { time: '11:00 AM -12:30 PM', task: 'Read the case study and user interview report' },
                { time: '1:30 PM', task: 'Stand-up and get ready for the designs' },
                { time: '2:30 PM', task: 'Stakeholder meeting with PM' },
                { time: '3:15 PM', task: 'User flower presentation' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <span className="font-medium text-forest-800 whitespace-nowrap text-xs">{item.time}</span>
                  <span className="text-forest-700 text-xs">{item.task}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Checklist + Projects Allocated */}
        <div className="space-y-4">
          <Card variant="default" className="p-4 border-rose-200">
            <div className="space-y-2.5">
              {[
                'Complete the Notification Panel',
                "Commit yesterday's changes",
                'Review Admin Portal',
                'Exam Portal Pending',
              ].map((item, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer text-sm text-forest-700">
                  <input type="checkbox" className="w-4 h-4 rounded border-forest-300 accent-forest-700" />
                  {item}
                </label>
              ))}
            </div>
          </Card>

          <Card variant="olive" className="p-4 flex items-center justify-between">
            <div>
              <CardTitle className="text-forest-900">PROJECTS</CardTitle>
              <CardTitle className="text-forest-900">ALLOCATED</CardTitle>
            </div>
            <span className="text-5xl font-bold text-forest-800">4</span>
          </Card>
        </div>
      </div>

      {/* On-Going Projects */}
      <div>
        <h2 className="text-xl font-bold text-forest-900 mb-4">ON-GOING PROJECTS</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[
            { name: 'School ERP Project', date: '12 July, 2026' },
            { name: 'Management Project', date: '20 July, 2026' },
            { name: 'Intern Management', date: '25 July, 2026' },
          ].map((project, i) => (
            <Card key={i} variant="forest" className="p-4 min-w-[220px] flex-shrink-0">
              <h3 className="font-bold text-base mb-1">{project.name}</h3>
              <p className="text-cream-200 text-xs mb-3">Progress</p>
              <div className="flex items-center gap-2 text-xs text-cream-200">
                <Play className="w-3 h-3 text-rose-300 fill-rose-300" />
                {project.date}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button variant="outline" leftIcon={<MessageSquare className="w-4 h-4" />}>
          Go to Messages
        </Button>
        <Button variant="primary" leftIcon={<CalendarPlus className="w-4 h-4" />}>
          Schedule a meeting
        </Button>
      </div>

      {/* Logout */}
      <div className="flex justify-center pt-4 pb-8">
        <Button variant="ghost" leftIcon={<LogOut className="w-4 h-4" />} className="text-forest-500">
          Log out
        </Button>
      </div>
    </div>
  );
};

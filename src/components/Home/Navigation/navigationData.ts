import { CalendarDaysIcon } from "@heroicons/react/24/solid";

export const actions = {
  Intern: [{ label: "Attendance", to: "/attendance", icon: CalendarDaysIcon }],
  "Department Head": [
    { label: "Attendance", to: "/attendance", icon: CalendarDaysIcon },
    { label: "Announcement", to: "/announcement", icon: CalendarDaysIcon },
    { label: "Create Task", to: "/tasks", icon: CalendarDaysIcon },
  ],
  //   Supervisor: [
  //     { label: "Intern List", to: "/interns", icon: "👥" },
  //     { label: "View Daily Reports", to: "/reports/daily", icon: "📝" },
  //     { label: "View Weekly Reports", to: "/reports/weekly", icon: "📆" },
  //     { label: "View Monthly Reports", to: "/reports/monthly", icon: "📊" },
  //   ],
} as const;

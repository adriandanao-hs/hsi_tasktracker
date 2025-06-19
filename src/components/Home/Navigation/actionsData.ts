import { DocumentTextIcon, CalendarDaysIcon } from "@heroicons/react/24/solid";

export const actions = {
  Intern: [
  
  ],
  "Department Head": [
    { label: "Intern List", to: "/interns", icon: CalendarDaysIcon },
    { label: "Post Task", to: "/tasks", icon: CalendarDaysIcon },
    { label: "Daily Reports", to: "/reports/daily", icon: CalendarDaysIcon },
    { label: "Weekly Reports", to: "/reports/weekly", icon: CalendarDaysIcon },
    { label: "Monthly Reports", to: "/reports/monthly", icon: CalendarDaysIcon },
  ],
//   Supervisor: [
//     { label: "Intern List", to: "/interns", icon: "👥" },
//     { label: "View Daily Reports", to: "/reports/daily", icon: "📝" },
//     { label: "View Weekly Reports", to: "/reports/weekly", icon: "📆" },
//     { label: "View Monthly Reports", to: "/reports/monthly", icon: "📊" },
//   ],
};

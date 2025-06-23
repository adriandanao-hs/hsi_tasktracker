import { DocumentTextIcon, CalendarDaysIcon } from "@heroicons/react/24/solid";

export const actions = {
  Intern: [
    //{ label: "Daily Report", to: "/report/daily", icon: DocumentTextIcon },
    //{ label: "Weekly Report", to: "/report/weekly", icon: CalendarDaysIcon },
    //{ label: "Monthly Report", to: "/report/monthly", icon: CalendarDaysIcon },
    //{ label: "Time In / Time Out", to: "/attendance", icon: CalendarDaysIcon },
    //{ label: "My Departments", to: "/departments", icon: CalendarDaysIcon },
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

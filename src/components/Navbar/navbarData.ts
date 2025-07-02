import {
  HomeIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

export const actions = {
  Intern: [
    { label: "Home", to: "/home", icon: HomeIcon },
  ],
  "Department Head": [
    { label: "Home", to: "/home", icon: HomeIcon },
    { label: "Intern List", to: "/interns", icon: UserGroupIcon },
  ],
  //   Supervisor: [
  //     { label: "Intern List", to: "/interns", icon: "👥" },
  //     { label: "View Daily Reports", to: "/reports/daily", icon: "📝" },
  //     { label: "View Weekly Reports", to: "/reports/weekly", icon: "📆" },
  //     { label: "View Monthly Reports", to: "/reports/monthly", icon: "📊" },
  //   ],
};

import {
  DocumentTextIcon,
  HomeIcon,
  BuildingOfficeIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

export const actions = {
  Intern: [
    { label: "Home", to: "/home", icon: HomeIcon },
    {
      label: `Major Dept.`,
      to: "/department/major",
      icon: BuildingOfficeIcon,
    },
    {
      label: "Minor Dept.",
      to: "/department/minor",
      icon: BuildingOffice2Icon,
    },
    { label: "Reports", to: "/reports", icon: DocumentTextIcon },
  ],
  "Department Head": [
    { label: "Home", to: "/home", icon: HomeIcon },
    { label: "Dept.", to: "/tasks", icon: BuildingOfficeIcon },
    { label: "Intern List", to: "/interns", icon: UserGroupIcon },
    { label: "Daily Reports", to: "/reports/daily", icon: DocumentTextIcon },
  ],
  //   Supervisor: [
  //     { label: "Intern List", to: "/interns", icon: "👥" },
  //     { label: "View Daily Reports", to: "/reports/daily", icon: "📝" },
  //     { label: "View Weekly Reports", to: "/reports/weekly", icon: "📆" },
  //     { label: "View Monthly Reports", to: "/reports/monthly", icon: "📊" },
  //   ],
};

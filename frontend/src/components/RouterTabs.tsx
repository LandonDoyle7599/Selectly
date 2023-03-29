import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useRouteMatch } from "../utils/helperFunctions";


export const RouterTabs = () => {
  const routeMatch = useRouteMatch([
    "/dashboard",
    "/profile",
    "/history"
  ]);
  const currentTab = routeMatch?.pattern?.path;
  const {token} = useAuth();

  const authTabs = [
    {
        label: "Dashboard",
        path: "/dashboard",
    },
    {
      label: "Profile",
      path: "/profile",
    },
    {
        label: "History",
        path: "/history",
    },
  ];

  const getTabOptions = (() => {
    if (!token) {
      return [];
    }else{
        return authTabs;
    }
  })();

  return (
    <Tabs value={currentTab ?? "/home"}>
      {getTabOptions.map((tab) => (
        <Tab
          label={tab.label}
          value={tab.path}
          to={tab.path}
          component={Link}
        />
      ))}
    </Tabs>
  );
};

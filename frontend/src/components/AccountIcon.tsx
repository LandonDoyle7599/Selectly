import { Button, IconButton, Popover } from "@material-ui/core";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { Stack } from "@mui/system";
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

export const AccountIcon = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { pathname } = useLocation();

  if (
    pathname === "/home" ||
    pathname === "/login" ||
    pathname === "/createAccount" ||
    pathname === "/"
  )
    return <Outlet />;

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/home");
  };

  return (
    <>
      <Stack
        direction="row-reverse"
        sx={{
          width: "100%",
          backgroundColor: "primary.main",
          paddingTop: 0,
          marginTop: 0,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <AccountCircleRoundedIcon fontSize="large" />
        </IconButton>

        <Popover
          open={!!anchorEl}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <Stack direction={"column"}>
            <Button
              style={{ padding: 2 }}
              variant="text"
              onClick={() => navigate("/profile")}
            >
              Profile
            </Button>
            <Button style={{ padding: 2 }} variant="text" onClick={logout}>
              Sign Out
            </Button>
          </Stack>
        </Popover>
      </Stack>
      <Outlet />
    </>
  );
};

import { Button, IconButton, Popover, Typography } from "@material-ui/core";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

export const AccountIcon = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { pathname } = useLocation();
  const { token } = useAuth();
  const logout = () => {
    localStorage.clear();
    setAnchorEl(null);
    navigate("/home");
  };

  const signIn = () => {
    setAnchorEl(null);
    navigate("/login");
  };

  useEffect(() => {
    if(!token) return;
  }, [token]);

  return (
    <>
      {/* <Stack
        direction="row-reverse"
        sx={{
          width: "100%",
          backgroundColor: "primary.main",
          paddingTop: 0,
          marginTop: 0,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      > */}
        <IconButton onClick={(e) => {
          
          setAnchorEl(e.currentTarget)}
        }>
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
            {(token !== "" && token !== null) ? (
            <Button style={{ padding: 2 }} variant="text" onClick={logout}>
              <Typography variant="body1">Logout</Typography>
            </Button>
            ) : (
            <Button style={{ padding: 2 }} variant="text" onClick={signIn}>
              <Typography variant="body1">Sign In</Typography>
            </Button>
            )}
          </Stack>
        </Popover>
      {/* </Stack> */}
    </>
  );
};

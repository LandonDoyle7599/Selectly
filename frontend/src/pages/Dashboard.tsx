import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { Button, IconButton, Popover, Popper, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateAuth } from "../hooks/checkAuth";

export const Dashboard: FC = () => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const navigate = useNavigate();
  validateAuth();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/home");
  };

  return (
    <Stack sx={{ width: "100vw", height: "100vh" }} direction="column">
      <Stack
        direction="row"
        sx={{
          width: "100%",
          height: "10vh",
          backgroundColor: "primary.main",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1 style={{ color: "white", marginLeft: "2rem" }}>Dashboard</h1>
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="large">
          <AccountCircleRoundedIcon
            style={{ color: "white" }}
            fontSize="large"
          />
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
              sx={{ p: 2 }}
              variant="text"
              onClick={() => navigate("/profile")}
            >
              Profile
            </Button>
            <Button sx={{ p: 2 }} variant="text" onClick={logout}>
              Sign Out
            </Button>
          </Stack>
        </Popover>
      </Stack>
      <Button onClick={() => navigate("/profile")}>Profile</Button>
      <Button onClick={() => navigate("/history")}>History</Button>
      <Button onClick={() => navigate("/createDeck")}>Deck creation</Button>
      <Button onClick={() => navigate("/startVoting")}>Start voting</Button>
    </Stack>
  );
};

import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import {Link} from "react-router-dom";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import {ListItemIcon} from "@mui/material";

export default function CustomMenuList(props: any) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {props.page.listItems ? (
        <Button
          id="fade-button"
          aria-controls={open ? "fade-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          variant={"contained"}
          color="secondary"
          sx={{maxWidth: "150px", margin: " 10px"}}
          endIcon={open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        >
          {props.page.name}
        </Button>
      ) : (
        <Link
          to={props.page.url}
          style={{textDecoration: "none", color: "inherit"}}
        >
          <Button
            id="fade-button"
            aria-controls={open ? "fade-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            variant={"contained"}
            color="secondary"
            sx={{minWidth: "150px", margin: " 10px"}}
          >
            {props.page.name}
          </Button>
        </Link>
      )}

      {props.page.listItems && (
        <Menu
          id="fade-menu"
          MenuListProps={{
            "aria-labelledby": "fade-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          TransitionComponent={Fade}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{horizontal: "right", vertical: "top"}}
          anchorOrigin={{horizontal: "right", vertical: "bottom"}}
        >
          {props.page.listItems.map((item: any, key: any) => (
            <div key={key}>
              <Link
                to={item.url}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  minWidth: "100%",
                }}
              >
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  {item.name}
                </MenuItem>
              </Link>
            </div>
          ))}
        </Menu>
      )}
    </div>
  );
}

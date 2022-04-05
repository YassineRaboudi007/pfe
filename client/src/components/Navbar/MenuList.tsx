import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import {Link} from "react-router-dom";

export default function CustomMenuList(props: any) {
  console.log("porps ", props);

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
        >
          {props.page.name}
        </Button>
      ) : (
        <Link to={props.page.url}>
          <Button
            id="fade-button"
            aria-controls={open ? "fade-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            variant={"contained"}
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
        >
          {props.page.listItems.map((item: any, key: any) => (
            <div key={key}>
              <Link to={item.url}>
                <MenuItem onClick={handleClose}>{item.name}</MenuItem>
              </Link>
            </div>
          ))}
        </Menu>
      )}
    </div>
  );
}

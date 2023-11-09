import { useEffect, useState } from "react";
import Axios from 'axios';
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import '@fortawesome/fontawesome-free/css/all.css';
import { Box, IconButton, Skeleton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../theme";
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { AuthContext } from "../context/Context";
import { Collapse } from "@mui/material";
import { useContext } from "react";
const Item = ({ title, to, icon, selected, setSelected, isCollapsed, isMobile, handleSidebar }) => {
  const handleClick = (title) => {
    if (isMobile) {
      handleSidebar();
    }
    setSelected(title);
  }

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => !isCollapsed && handleClick(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      {!isCollapsed && <Link to={to} />}
    </MenuItem>
  );
};

const Itemtest = ({ title, to, icon, selected, setSelected, subMenu, isCollapsed, isMobile, handleSidebar }) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const handleSubMenuToggle = () => {
    setSelected(title);
    setIsSubMenuOpen(!isSubMenuOpen);

  };
  const handleIsMobile = () => {
    if (isMobile) {
      handleSidebar();
    }
  }
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <>
      <MenuItem
        active={selected === title}
        style={{
          color: colors.grey[100],
          flexDirection: "row",
          alignItems: "center",

        }}
        onClick={() => !isCollapsed && handleSubMenuToggle()}
        icon={icon}
        suffix={!isCollapsed && (isSubMenuOpen ? <i className="fa fa-sort-up"></i> : <i className="fa fa-sort-down"></i>)}
      >
        <Typography>{title}</Typography>
        {/* <Link to={to} /> */}
      </MenuItem>
      {subMenu && (
        <Collapse in={isSubMenuOpen}>
          <div onClick={() => handleIsMobile()} style={{ display: "flex", marginLeft: '20px', backgroundColor: colors.primary[500], justifyContent: 'space-between' }}>{subMenu}</div>
        </Collapse>
      )}
    </>
  );
};

const Sidebar = () => {
  const { currentUser } = useContext(AuthContext)
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [username, setUserName] = useState('');
  const [role, setRole] = useState('');
  const [shop, setShop] = useState('');
  const [profile, setProfile] = useState(`../../assets/user.png`);
  const [isMobile, setisMobile] = useState(false);
  const [breakPoint, setBreakPoint] = useState(false);
  const [display, setDisplay] = useState('');
  const [profilLoding, setProfilLoding] = useState(true);

  useEffect(() => {
    setProfilLoding(true)
    Axios.post('/auth/refresh', {
      withCredentials: true,
    }).then((response) => {
      setUserName(response.data.adminName);
      setRole(response.data.type);
      setProfile('../../assets/user.png')
      setShop(response.data.warehouseName)
      setProfilLoding(false)
    }).catch((error) => {
      console.log(error);
    })
  }, []);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsCollapsed(true);
        setisMobile(true);
        setBreakPoint(true);
        setDisplay('');
      } else {
        setIsCollapsed(false);
        setisMobile(false);
        setBreakPoint(false);
        setDisplay('display');
      }
    };

    handleResize(); // Check initial screen size
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [window.innerWidth]);

  const handleSidebar = () => {
    setBreakPoint(!breakPoint);
    setIsCollapsed(!isCollapsed);
  }
  const handleCollapse = () => {
    if (isMobile) {
      handleSidebar();
    } else {
      setIsCollapsed(!isCollapsed);
    }
  }
  return (
    <Box style={{ width: window.innerWidth <= 768 && 0 }}
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
        height: '100vh',
      }}
    >
      <ProSidebar collapsed={isCollapsed} breakPoint={breakPoint ? 'sm' : ''}>
        <Menu >
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"

              >
                <Typography variant="h3" color={colors.grey[100]}>
                  STMS
                </Typography>
                <IconButton onClick={() => handleCollapse()}>
                  <MenuOutlinedIcon />
                </IconButton>

              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                {profilLoding ? <Skeleton variant="circular" width={100} height={100} />
                  : <img
                    alt="profile-user"
                    width="100px"
                    height="100px"
                    src={profile}
                    style={{ cursor: "pointer", borderRadius: "50%" }}
                  />}
              </Box>
              <Box textAlign="center">
                <Typography style={{ display: "flex", justifyContent: "center" }}
                  variant="h3"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 10px 0px" }}
                >
                  {profilLoding ?
                    <Skeleton variant="rounded" width={220} height={30} /> :
                    username}
                </Typography>
                <Typography style={{ display: "flex", justifyContent: "center" }}
                  variant="h5" color={colors.greenAccent[500]}>
                  {profilLoding ?
                    <Skeleton variant="rounded" width={150} height={30} /> :
                    role + "  of  " + shop}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "0px"}>
            <Item
              title="Shop"
              to="/shop"
              icon={<i className="fas fa-shopping-bag"></i>}
              selected={selected}
              setSelected={setSelected}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              isMobile={isMobile}
              handleSidebar={handleSidebar}
              />
              {currentUser.isSubstore && <Item
                title="Substore"
                to="/substore"
                icon={<i className="fas fa-building"></i>}
                selected={selected}
                setSelected={setSelected}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                isMobile={isMobile}
                handleSidebar={handleSidebar}
              />}
            <Item
              title="Credits"
              to="/credits"
              icon={<i className="fas fa-credit-card"></i>}
              selected={selected}
              setSelected={setSelected}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              isMobile={isMobile}
              handleSidebar={handleSidebar}
            />
            <Item
              title="Expenses"
              to="/exspense_pending"
              icon={<ShoppingCartCheckoutIcon/>}
              selected={selected}
              setSelected={setSelected}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              isMobile={isMobile}
              handleSidebar={handleSidebar}
            />
            <Itemtest
              title="Pending"
              icon={<i class="fa fa-clock"></i>}
              selected={selected}
              setSelected={setSelected}
              isCollapsed={isCollapsed}
              isMobile={isMobile}
              setIsCollapsed={setIsCollapsed}
              handleSidebar={handleSidebar}
              subMenu={
                <Menu>
                  <MenuItem
                    active={selected === "Sales Pending"}
                    icon={<i className="fas fa-history"></i>}
                    onClick={() => setSelected("Sales Pending")}
                  >
                    <Typography>Sales Pending</Typography>
                    <Link to="/salespendinng" />
                  </MenuItem>

                  {currentUser.isSubstore && <MenuItem
                    active={selected === "Pending to Shop Items"}
                    icon={<i className="fas fa-history"></i>}
                    onClick={() => setSelected("Pending to Shop Items")}
                  >
                    <Typography>Pending to Shop Items</Typography>
                    <Link to="/shoppendinng" />
                  </MenuItem>}
                </Menu>
              }
            />
            <Itemtest
              title="History"
              icon={<i class="fa fa-history"></i>}
              selected={selected}
              setSelected={setSelected}
              isCollapsed={isCollapsed}
              isMobile={isMobile}
              setIsCollapsed={setIsCollapsed}
              handleSidebar={handleSidebar}
              subMenu={
                <Menu>
                  <MenuItem
                    active={selected === "Store to Store History"}
                    icon={<i className="fas fa-exchange-alt"></i>}
                    onClick={() => setSelected("Store to Store History")}
                  >
                    <Typography>Store To Store History</Typography>
                    <Link to="/storehistory" />
                  </MenuItem>
                  <MenuItem
                    active={selected === "Sales History"}
                    icon={<i className="fas fa-history"></i>}
                    onClick={() => setSelected("Sales History")}
                  >
                    <Typography>Sales History</Typography>
                    <Link to="/saleshistory" />
                  </MenuItem>
                </Menu>
              }
            />

          </Box>
        </Menu>
      </ProSidebar>
      <IconButton sx={{
        marginTop: '30px',
        marginLeft: '5px',
      }} className={display} onClick={() => handleSidebar()}>
        <MenuOutlinedIcon />
      </IconButton>
    </Box>
  );
};

export default Sidebar;

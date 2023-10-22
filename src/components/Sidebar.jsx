import { useEffect, useState } from "react";
import Axios from 'axios';
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import '@fortawesome/fontawesome-free/css/all.css';
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { AuthContext } from "../context/Context";
import { Collapse } from "@mui/material";
import { useContext } from "react";
const Item = ({ title, to, icon, selected, setSelected, isCollapsed, isMobile, setIsCollapsed }) => {
  const handleClick = (title) => {
    if (isMobile) {
      setIsCollapsed(!isCollapsed);
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

const Itemtest = ({ title, to, icon, selected, setSelected, subMenu, isCollapsed, isMobile, setIsCollapsed }) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const handleSubMenuToggle = () => {
    setSelected(title);
    setIsSubMenuOpen(!isSubMenuOpen);

  };
  const handleIsMobile = () => {
    if (isMobile) {
      setIsCollapsed(!isCollapsed);
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
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [isMobile, setisMobile] = useState(false);
  const [breakPoint, setBreakPoint] = useState(false);
  const [display, setDisplay] = useState('');
  useEffect(() => {
    Axios.post('/auth/refresh', {
      withCredentials: true,
    }).then((response) => {
      setUserName(response.data.adminName);
      setEmail(response.data.email);
      setRole(response.data.type);
      console.log(username);
      console.log(email);
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
                  SMS
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
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`../../assets/user.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h3"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 10px 10px" }}
                >
                  {username}
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  {role}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "0px"}>
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              isMobile={isMobile}
            />
            <Itemtest
              title="Pending"
              icon={<i class="fa fa-clock"></i>}
              selected={selected}
              setSelected={setSelected}
              isCollapsed={isCollapsed}
              isMobile={isMobile}
              setIsCollapsed={setIsCollapsed}
              subMenu={
                <Menu>
                  <MenuItem
                    active={selected === "sales Pending"}
                    icon={<i className="fas fa-history"></i>}
                    onClick={() => setSelected("sales Pending")}
                  >
                    <Typography>sales Pending</Typography>
                    <Link to="/salespendinng" />
                  </MenuItem>

                  {currentUser.isSubstore &&<MenuItem
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
            {currentUser.isSubstore&& <Item
              title="substore"
              to="/substore"
              icon={<i className="fas fa-building"></i>}
              selected={selected}
              setSelected={setSelected}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              isMobile={isMobile}
            />}
            <Item
              title="shop"
              to="/shop"
              icon={<i className="fas fa-shopping-bag"></i>}
              selected={selected}
              setSelected={setSelected}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              isMobile={isMobile}
            />
            
          </Box>
        </Menu>
      </ProSidebar>
      <IconButton sx={{
        marginTop: '30px',
        marginLeft: '5px',
        overflowY: 'auto'
      }} className={display} onClick={() => handleSidebar()}>
        <MenuOutlinedIcon />
      </IconButton>
    </Box>
  );
};

export default Sidebar;

// import { useEffect, useState } from "react";
// import Axios from 'axios';
// import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
// import 'react-pro-sidebar/dist/css/styles.css';
// import '@fortawesome/fontawesome-free/css/all.css';
// import { Box, IconButton, Typography, useTheme } from "@mui/material";
// import { Link } from "react-router-dom";
// import { tokens } from "../theme";
// import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
// import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
// import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
// import { Collapse } from "@mui/material";
// const Item = ({ title, to, icon, selected, setSelected }) => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   return (
//     <MenuItem
//       active={selected === title}
//       style={{
//         color: colors.grey[100],
//       }}
//       onClick={() => setSelected(title)}
//       icon={icon}
//     >
//       <Typography>{title}</Typography>
//       <Link to={to} />
//     </MenuItem>
//   );
// };

// const Itemtest = ({ title, to, icon, selected, setSelected, subMenu , isCollapsed}) => {
//    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

//   const handleSubMenuToggle = () => {
//     setSelected(title);
//     setIsSubMenuOpen(!isSubMenuOpen);
//   };
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   return (
//     <>
//       <MenuItem
//         active={selected === title}
//         style={{
//           color: colors.grey[100],
//           flexDirection: "row",
//           alignItems: "center",
         
//         }}
//         onClick={() => handleSubMenuToggle()}
//         icon={icon}
//         suffix={!isCollapsed && (isSubMenuOpen ? <i className="fa fa-sort-up"></i> : <i className="fa fa-sort-down"></i>)}
//       >
//         <Typography>{title}</Typography>
//         {/* <Link to={to} /> */}
//       </MenuItem>
//       {subMenu && (
//         <Collapse in={isSubMenuOpen}>
//           <div style={{ display: "flex", marginLeft: '20px', backgroundColor: colors.primary[500],justifyContent: 'space-between' }}>{subMenu}</div>
//         </Collapse>
//       )}
//     </>
//   );
// };

// const Sidebar = () => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [selected, setSelected] = useState("Dashboard");
//   const [username, setUserName] = useState('');
//   const [email, setEmail] = useState('');
//   const [role, setRole] = useState('');
//   useEffect(() => {
//     Axios.post('/auth/refresh',{
//       withCredentials: true,
//     }).then((response) => {
//         setUserName(response.data.adminName);
//         setEmail(response.data.email);
//         setRole(response.data.type);
//         console.log(username);
//         console.log(email);
//        }).catch((error) => {
//         console.log(error);
//        })
// }, []);
//     useEffect(() => {
//       const handleResize = () => {
//         if (window.innerWidth <= 768) {
//           setIsCollapsed(true);
//         } else {
//           setIsCollapsed(false);
//         }
//       };

//       handleResize(); // Check initial screen size
//       window.addEventListener("resize", handleResize);

//       return () => {
//         window.removeEventListener("resize", handleResize);
//       };
//     }, []);
//   return (
//     <Box
//       sx={{
//         "& .pro-sidebar-inner": {
//           background: `${colors.primary[400]} !important`,
//         },
//         "& .pro-icon-wrapper": {
//           backgroundColor: "transparent !important",
//         },
//         "& .pro-inner-item": {
//           padding: "5px 35px 5px 20px !important",
//         },
//         "& .pro-inner-item:hover": {
//           color: "#868dfb !important",
//         },
//         "& .pro-menu-item.active": {
//           color: "#6870fa !important",
//         },
//         height: '100vh',
//       }}
//     >
//       <ProSidebar collapsed={isCollapsed}>
//         <Menu iconShape="square">
//           {/* LOGO AND MENU ICON */}
//           <MenuItem
//             onClick={() => setIsCollapsed(!isCollapsed)}
//             icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
//             style={{
//               margin: "10px 0 20px 0",
//               color: colors.grey[100],
//             }}
//           >
//             {!isCollapsed && (
//               <Box
//                 display="flex"
//                 justifyContent="space-between"
//                 alignItems="center"
//                 ml="15px"
//               >
//                 <Typography variant="h3" color={colors.grey[100]}>
//                  SMS
//                 </Typography>
//                 <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
//                   <MenuOutlinedIcon />
//                 </IconButton>
//               </Box>
//             )}
//           </MenuItem>

//           {!isCollapsed && (
//             <Box mb="25px">
//               <Box display="flex" justifyContent="center" alignItems="center">
//                 <img
//                   alt="profile-user"
//                   width="100px"
//                   height="100px"
//                   src={`../../assets/user.png`}
//                   style={{ cursor: "pointer", borderRadius: "50%" }}
//                 />
//               </Box>
//               <Box textAlign="center">
//                 <Typography
//                   variant="h3"
//                   color={colors.grey[100]}
//                   fontWeight="bold"
//                   sx={{ m: "10px 0 10px 10px" }}
//                 >
//                  {username}
//                 </Typography>
//                 <Typography variant="h5" color={colors.greenAccent[500]}>
//                 {role}
//                 </Typography>
//               </Box>
//             </Box>
//           )}

//           <Box paddingLeft={isCollapsed ? undefined : "0px"}>
//             <Item
//               title="Dashboard"
//               to="/"
//               icon={<HomeOutlinedIcon />}
//               selected={selected}
//               setSelected={setSelected}
//             />
//              <Itemtest
//               title="Pending"
//               icon={<i class="fa fa-clock"></i>}
//               selected={selected}
//               setSelected={setSelected}
//               isCollapsed={isCollapsed}
//               subMenu={
//                 <Menu>
//                   <MenuItem
//                     active={selected === "sales Pending"}
//                     icon={<i className="fas fa-history"></i>}
//                     onClick={() => setSelected("sales Pending")}
//                   >
//                     <Typography>sales Pending</Typography>
//                     <Link to="/salespendinng" />
//                   </MenuItem>
//                   <MenuItem
//                     active={selected === "Pending to Shop Items"}
//                     icon={<i className="fas fa-history"></i>}
//                     onClick={() => setSelected("Pending to Shop Items")}
//                   >
//                     <Typography>Pending to Shop Items</Typography>
//                     <Link to="/shoppendinng" />
//                   </MenuItem>
//                 </Menu>
//               }
//             /> 
//             <Item
//               title="substore"
//               to="/substore"
//               icon={<i className="fas fa-building"></i>}
//               selected={selected}
//               setSelected={setSelected}
//             />
//             <Item
//               title="shop"
//               to="/shop"
//               icon={<i className="fas fa-shopping-bag"></i>}
//               selected={selected}
//               setSelected={setSelected}
//             />
//           </Box>
//         </Menu>
//       </ProSidebar>
//     </Box>
//   );
// };

// export default Sidebar;

import React, { useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import {
  List,
  Card,
  Avatar,
  Alert,
  ListItem,
  Accordion,
  AccordionBody,
  Typography,
  ListItemPrefix,
  IconButton,
} from "@material-tailwind/react";
import {
  TicketIcon,
  UserGroupIcon,
  Square2StackIcon,
  RectangleGroupIcon,
  ChatBubbleLeftEllipsisIcon,
  ChevronDownIcon,
  ArrowLeftStartOnRectangleIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/solid";

const AdminSidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const [open, setOpen] = React.useState(0);
  const [openAlert, setOpenAlert] = React.useState(true);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  const LIST_ITEM_STYLES =
    "text-gray-500 hover:text-white focus:text-white active:text-white hover:bg-opacity-20 focus:bg-opacity-20 active:bg-opacity-20";

  return (
    <Card 
      color="gray" 
      className={`fixed top-0 left-0 h-screen z-[999] transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-[4.5rem]' : 'w-[20rem]'
      } shadow-xl shadow-blue-gray-900/5`}
    >
      <div className={`mb-2 flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'} p-4`}>
        <img
          src="https://www.material-tailwind.com/logos/mt-logo.png"
          alt="brand"
          className="h-9 w-9"
        />
        {!isCollapsed && (
          <Typography className="text-lg font-bold text-gray-300">
            Material Tailwind
          </Typography>
        )}
      </div>

      {/* Collapse Toggle Button */}
      <IconButton
        variant="text"
        color="white"
        size="sm"
        className="!absolute top-6 -right-3 rounded-full bg-gray-800 p-1 z-50 hover:bg-gray-700"
        onClick={toggleCollapse}
      >
        {isCollapsed ? (
          <ChevronDoubleRightIcon className="h-4 w-4" />
        ) : (
          <ChevronDoubleLeftIcon className="h-4 w-4" />
        )}
      </IconButton>
      
      <hr className="my-2 border-gray-800" />
      
      <div className="h-[calc(100vh-8rem)] overflow-y-auto overflow-x-hidden">
        <List>
          <Accordion open={open === 1}>
            <ListItem
              selected={open === 1}
              data-selected={open === 1}
              onClick={() => handleOpen(1)}
              className={`p-3 hover:bg-opacity-20 text-gray-500 select-none focus:bg-opacity-20 active:bg-opacity-20 data-[selected=true]:bg-gray-50/20 hover:text-white focus:text-white active:text-white data-[selected=true]:text-white ${isCollapsed ? 'justify-center px-2' : ''}`}
            >
              <ListItemPrefix>
                <Avatar
                  size="sm"
                  src="https://www.material-tailwind.com/img/avatar1.jpg"
                />
              </ListItemPrefix>
              {!isCollapsed && (
                <Typography className="mr-auto font-normal text-inherit">
                  Brooklyn Alice
                </Typography>
              )}
              <ChevronDownIcon
                strokeWidth={3}
                className={`ml-auto text-gray-500 h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""}`}
              />
            </ListItem>
            <AccordionBody className="py-1">
              <List className="p-0">
                <ListItem className={`px-16 ${LIST_ITEM_STYLES}`}>
                  My Profile
                </ListItem>
                <ListItem className={`px-16 ${LIST_ITEM_STYLES}`}>
                  Settings
                </ListItem>
              </List>
            </AccordionBody>
          </Accordion>
          <hr className="my-2 border-gray-800" />
          <Accordion open={open === 2}>
            <ListItem
              selected={open === 2}
              data-selected={open === 2}
              onClick={() => handleOpen(2)}
              className={`px-3 py-[9px] hover:bg-opacity-20 text-gray-500 select-none focus:bg-opacity-20 active:bg-opacity-20 data-[selected=true]:bg-gray-50/20 hover:text-white focus:text-white active:text-white data-[selected=true]:text-white ${isCollapsed ? 'justify-center px-2' : ''}`}
            >
              <ListItemPrefix>
                <RectangleGroupIcon className="h-5 w-5" />
              </ListItemPrefix>
              {!isCollapsed && (
                <Typography className="mr-auto font-normal text-inherit">
                  Dashboard
                </Typography>
              )}
              <ChevronDownIcon
                strokeWidth={3}
                className={`ml-auto text-gray-500 h-4 w-4 transition-transform ${open === 2 ? "rotate-180" : ""}`}
              />
            </ListItem>
            <AccordionBody className="py-1">
              <List className="p-0">
                <ListItem className={`px-12 ${LIST_ITEM_STYLES}`}>
                  Analytics
                </ListItem>
                <ListItem className={`px-12 ${LIST_ITEM_STYLES}`}>
                  Sales
                </ListItem>
              </List>
            </AccordionBody>
          </Accordion>
          <ListItem className={`${LIST_ITEM_STYLES} ${isCollapsed ? 'justify-center px-2' : ''}`}>
            <ListItemPrefix>
              <Square2StackIcon className="h-5 w-5" />
            </ListItemPrefix>
            {!isCollapsed && 'Products'}
          </ListItem>
          <ListItem className={`${LIST_ITEM_STYLES} ${isCollapsed ? 'justify-center px-2' : ''}`}>
            <ListItemPrefix>
              <TicketIcon className="h-5 w-5" />
            </ListItemPrefix>
            {!isCollapsed && 'Orders'}
          </ListItem>
          <ListItem className={`${LIST_ITEM_STYLES} ${isCollapsed ? 'justify-center px-2' : ''}`}>
            <ListItemPrefix>
              <UserGroupIcon className="h-5 w-5" />
            </ListItemPrefix>
            {!isCollapsed && 'Customers'}
          </ListItem>
        </List>
        <hr className="my-2 border-gray-800" />
        <List>
          <ListItem className={`${LIST_ITEM_STYLES} ${isCollapsed ? 'justify-center px-2' : ''}`}>
            <ListItemPrefix>
              <ChatBubbleLeftEllipsisIcon className="h-5 w-5" />
            </ListItemPrefix>
            {!isCollapsed && 'Help & Support'}
          </ListItem>
          <ListItem className={`${LIST_ITEM_STYLES} ${isCollapsed ? 'justify-center px-2' : ''}`}>
            <ListItemPrefix>
              <ArrowLeftStartOnRectangleIcon
                strokeWidth={2.5}
                className="h-5 w-5"
              />
            </ListItemPrefix>
            {!isCollapsed && 'Sign Out'}
          </ListItem>
        </List>
        {!isCollapsed && (
          <Alert
            open={openAlert}
            className="mt-auto bg-gray-800"
            variant="ghost"
          >
            <Typography
              variant="small"
              color="white"
              className="mb-1 font-bold"
            >
              New Version Available
            </Typography>
            <Typography variant="small" color="white" className="font-normal">
              Update your app and enjoy the new features and improvements.
            </Typography>
            <div className="mt-4 flex gap-4">
              <Typography
                as="a"
                href="#"
                variant="small"
                color="white"
                className="font-normal"
                onClick={() => setOpenAlert(false)}
              >
                Dismiss
              </Typography>
              <Typography
                as="a"
                href="#"
                variant="small"
                color="white"
                className="font-medium"
              >
                Upgrade Now
              </Typography>
            </div>
          </Alert>
        )}
        {!isCollapsed && (
          <Typography
            variant="small"
            className="mt-5 font-medium text-gray-400 flex justify-center"
          >
            mt v2.1.2
          </Typography>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gray-900 p-4">
        <ListItem 
          className={`${LIST_ITEM_STYLES} ${isCollapsed ? 'justify-center px-2' : ''} 
            text-red-500 hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10`}
        >
          <ListItemPrefix>
            <ArrowLeftStartOnRectangleIcon className="h-5 w-5" />
          </ListItemPrefix>
          {!isCollapsed && 'Çıkış Yap'}
        </ListItem>
      </div>
    </Card>
  );
};

export function Sidebar1() {
  return (
    <section className="grid place-items-center">
      <div className="grid gap-10 md:grid-cols-2 grid-cols-1">
        <SidebarLight />
        <AdminSidebar />
      </div>
    </section>
  );
}

export default AdminSidebar;
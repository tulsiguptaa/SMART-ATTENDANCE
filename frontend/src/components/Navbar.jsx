import React from 'react';
import { useDisclosure, useColorMode, useColorModeValue, IconButton, Avatar, Menu, MenuButton, MenuList, MenuItem, MenuDivider, Box, Flex, Text, VStack, HStack, useBreakpointValue, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Button } from '@chakra-ui/react';
import { FiMenu, FiSun, FiMoon, FiBell, FiChevronDown, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Auth';
import Sidebar from './Sidebar';

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'white');
  const hoverBg = useColorModeValue('gray.100', 'whiteAlpha.200');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <>
      <Box
        as="header"
        bg={bgColor}
        borderBottom="1px"
        borderColor={borderColor}
        px={{ base: 4, md: 6 }}
        py={3}
      >
        <Flex justify="space-between" align="center">
          {/* Mobile menu button */}
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            onClick={onOpen}
            icon={<FiMenu />}
            variant="ghost"
            aria-label="Open menu"
          />

          {/* Logo / Title */}
          <Text
            fontSize="xl"
            fontWeight="bold"
            color="brand.500"
            display={{ base: 'none', md: 'block' }}
          >
            QR Attendance Pro
          </Text>

          <Flex align="center" gap={4}>
            {/* Theme Toggle */}
            <IconButton
              aria-label="Toggle theme"
              icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
              onClick={toggleColorMode}
              variant="ghost"
              size="md"
            />

            {/* Notifications */}
            <IconButton
              aria-label="Notifications"
              icon={<FiBell />}
              variant="ghost"
              size="md"
              position="relative"
            >
              <Box
                position="absolute"
                top="2"
                right="2"
                w="2"
                h="2"
                bg="red.500"
                borderRadius="full"
              />
            </IconButton>

            {/* User Menu */}
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                rightIcon={<FiChevronDown />}
                leftIcon={
                  <Avatar
                    size="sm"
                    name={user?.name || 'User'}
                    src={user?.avatar}
                    bg="brand.500"
                    color="white"
                  />
                }
                px={2}
                py={2}
                _hover={{ bg: hoverBg }}
                _expanded={{ bg: hoverBg }}
              >
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing={0}
                  ml={2}
                >
                  <Text fontSize="sm" fontWeight="medium">
                    {user?.name || 'User'}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {user?.role || 'User'}
                  </Text>
                </VStack>
              </MenuButton>
              <MenuList zIndex={9999}>
                <MenuItem icon={<FiUser />} as={RouterLink} to="/profile">
                  Profile
                </MenuItem>
                <MenuItem icon={<FiSettings />} as={RouterLink} to="/settings">
                  Settings
                </MenuItem>
                <MenuDivider />
                <MenuItem icon={<FiLogOut />} onClick={handleLogout} color="red.500">
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </Box>

      {/* Mobile Sidebar Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>QR Attendance Pro</DrawerHeader>
          <DrawerBody p={0}>
            <Sidebar onClose={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Navbar;

import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Icon,
  Text,
  Divider,
  useColorModeValue,
  Link as ChakraLink,
} from '@chakra-ui/react';
import {
  FiHome,
  FiCalendar,
  FiUser,
  FiSettings,
  FiLogOut,
  FiQrCode,
  FiBarChart2,
  FiUsers,
} from 'react-icons/fi';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/Auth';

const SidebarItem = ({ icon, children, to, ...rest }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const activeBg = useColorModeValue('brand.50', 'whiteAlpha.100');
  const activeColor = useColorModeValue('brand.600', 'white');
  const hoverBg = useColorModeValue('gray.100', 'whiteAlpha.200');

  return (
    <ChakraLink
      as={RouterLink}
      to={to}
      w="full"
      _hover={{ textDecoration: 'none', bg: hoverBg }}
      _activeLink={{
        bg: activeBg,
        color: activeColor,
        fontWeight: 'medium',
      }}
      bg={isActive ? activeBg : 'transparent'}
      color={isActive ? activeColor : 'inherit'}
      borderRadius="md"
      px={3}
      py={2}
      display="flex"
      alignItems="center"
      {...rest}
    >
      <HStack spacing={3}>
        <Icon as={icon} boxSize={5} />
        <Text fontSize="md">{children}</Text>
      </HStack>
    </ChakraLink>
  );
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const hoverBg = useColorModeValue('gray.100', 'whiteAlpha.200');

  return (
    <Box
      as="nav"
      w={{ base: 'full', md: '250px' }}
      h="100vh"
      bg={useColorModeValue('white', 'gray.800')}
      borderRight="1px"
      borderColor={borderColor}
      py={6}
      px={4}
      display="flex"
      flexDirection="column"
    >
      <Box mb={8} px={3}>
        <Text fontSize="xl" fontWeight="bold" color="brand.500">
          QR Attendance
        </Text>
      </Box>

      <VStack spacing={1} flex={1} align="stretch">
        <SidebarItem icon={FiHome} to="/">
          Dashboard
        </SidebarItem>
        
        <SidebarItem icon={FiQrCode} to="/scan">
          Scan QR
        </SidebarItem>
        
        <SidebarItem icon={FiCalendar} to="/attendance">
          My Attendance
        </SidebarItem>
        
        {user?.role === 'teacher' && (
          <>
            <SidebarItem icon={FiUsers} to="/teacher/dashboard">
              Manage Class
            </SidebarItem>
            <SidebarItem icon={FiBarChart2} to="/reports">
              Reports
            </SidebarItem>
          </>
        )}
        
        <Divider my={2} />
        
        <SidebarItem icon={FiUser} to="/profile">
          Profile
        </SidebarItem>
        
        <SidebarItem icon={FiSettings} to="/settings">
          Settings
        </SidebarItem>
      </VStack>

      <Box mt="auto" pt={4} borderTopWidth="1px" borderColor={borderColor}>
        <ChakraLink
          as="button"
          onClick={logout}
          w="full"
          display="flex"
          alignItems="center"
          px={3}
          py={2}
          borderRadius="md"
          _hover={{ bg: hoverBg, textDecoration: 'none' }}
          color={useColorModeValue('red.600', 'red.400')}
        >
          <HStack spacing={3}>
            <Icon as={FiLogOut} boxSize={5} />
            <Text fontSize="md">Logout</Text>
          </HStack>
        </ChakraLink>
        
        <Box mt={4} px={3} fontSize="sm" color="gray.500">
          <Text>Logged in as:</Text>
          <Text fontWeight="medium" color={useColorModeValue('gray.700', 'gray.300')}>
            {user?.name || 'User'}
          </Text>
          <Text fontSize="xs" color={useColorModeValue('gray.500', 'gray.400')}>
            {user?.email || 'user@example.com'}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;

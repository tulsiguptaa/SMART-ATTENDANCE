import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Text,
  Avatar,
  useToast,
  useColorModeValue,
  IconButton,
  InputGroup,
  InputRightElement,
  FormHelperText,
  Divider,
  Badge
} from '@chakra-ui/react';
import { FiEdit2, FiEye, FiEyeOff, FiSave } from 'react-icons/fi';
import { useAuth } from '../context/Auth';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const toast = useToast();

  // Set initial form data when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate passwords if changing password
      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        throw new Error('New passwords do not match');
      }

      // Prepare update data
      const updateData = {
        name: formData.name,
        ...(formData.currentPassword && {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      };

      await updateProfile(updateData);
      
      toast({
        title: 'Profile updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      setIsEditing(false);
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      toast({
        title: 'Error updating profile',
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (!user) return null;

  return (
    <Container maxW="container.lg" py={8}>
      <Box maxW="2xl" mx="auto">
        <Stack spacing={8}>
          {/* Profile Header */}
          <Stack direction={{ base: 'column', md: 'row' }} spacing={6} align="center">
            <Avatar
              size="2xl"
              name={user.name}
              src={user.avatar}
              bg="brand.500"
              color="white"
              fontSize="4xl"
              fontWeight="bold"
            />
            <Box>
              <Stack direction="row" align="center" spacing={4} mb={2}>
                <Heading size="lg">{user.name}</Heading>
                <Badge colorScheme={user.role === 'admin' ? 'purple' : 'blue'} fontSize="0.8em">
                  {user.role?.toUpperCase()}
                </Badge>
              </Stack>
              <Text fontSize="lg" color="gray.500">{user.email}</Text>
              <Text fontSize="md" color="gray.500">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </Text>
            </Box>
          </Stack>

          <Divider />

          {/* Profile Form */}
          <Box
            as="form"
            onSubmit={handleSubmit}
            bg={cardBg}
            p={6}
            rounded="lg"
            shadow="md"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Stack spacing={6}>
              <Stack direction={{ base: 'column', md: 'row' }} spacing={6}>
                <FormControl id="name" isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    isDisabled={!isEditing}
                    placeholder="Enter your name"
                  />
                </FormControl>

                <FormControl id="email">
                  <FormLabel>Email address</FormLabel>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    isDisabled={true}
                    bg={useColorModeValue('gray.100', 'gray.700')}
                  />
                  <FormHelperText>Email cannot be changed</FormHelperText>
                </FormControl>
              </Stack>

              {isEditing && (
                <>
                  <Divider my={4} />
                  
                  <Heading size="md" mb={4}>Change Password</Heading>
                  
                  <FormControl id="currentPassword">
                    <FormLabel>Current Password</FormLabel>
                    <InputGroup>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        placeholder="Enter current password"
                      />
                      <InputRightElement>
                        <IconButton
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          icon={showPassword ? <FiEyeOff /> : <FiEye />}
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormHelperText>Leave blank to keep current password</FormHelperText>
                  </FormControl>

                  <FormControl id="newPassword">
                    <FormLabel>New Password</FormLabel>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Enter new password"
                    />
                  </FormControl>

                  <FormControl id="confirmPassword">
                    <FormLabel>Confirm New Password</FormLabel>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm new password"
                    />
                  </FormControl>
                </>
              )}

              <Stack direction="row" spacing={4} justifyContent="flex-end" pt={4}>
                {isEditing ? (
                  <>
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        // Reset form to original values
                        setFormData({
                          name: user.name || '',
                          email: user.email || '',
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                      }}
                      isDisabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      colorScheme="brand"
                      leftIcon={<FiSave />}
                      isLoading={isLoading}
                      loadingText="Saving..."
                    >
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button
                    leftIcon={<FiEdit2 />}
                    colorScheme="brand"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
};

export default Profile;

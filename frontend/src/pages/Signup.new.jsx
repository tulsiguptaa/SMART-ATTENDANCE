import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  Image,
  Icon,
  Divider,
  Link,
  FormHelperText,
} from '@chakra-ui/react';
import { FiEye, FiEyeOff, FiUser, FiMail, FiHash, FiLock } from 'react-icons/fi';
import { useAuth } from '../context/Auth';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNumber: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.rollNumber) {
      newErrors.rollNumber = 'Roll number is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const { confirmPassword, ...userData } = formData;
      const { success, error } = await register(userData);
      
      if (success) {
        toast({
          title: 'Account created!',
          description: 'Your account has been created successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate('/login');
      } else {
        throw new Error(error || 'Registration failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create account. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Gradient background colors
  const bgGradient = useColorModeValue(
    'linear(to-r, brand.50, blue.50)',
    'linear(to-r, gray.900, blue.900)'
  );

  const cardBg = useColorModeValue('white', 'gray.800');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bgGradient={bgGradient}
      p={4}
    >
      <Container maxW="md">
        <Stack spacing={8}>
          <Stack align="center">
            <Box textAlign="center">
              <Image
                src="/logo.png"
                alt="QR Attendance Pro"
                boxSize="80px"
                mx="auto"
                mb={4}
                fallback={
                  <Box
                    w="80px"
                    h="80px"
                    borderRadius="full"
                    bg="brand.500"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontSize="2xl" fontWeight="bold" color="white">
                      QAP
                    </Text>
                  </Box>
                }
              />
              <Heading as="h1" size="xl" mb={2}>
                Create an Account
              </Heading>
              <Text color={mutedTextColor}>
                Join QR Attendance Pro today
              </Text>
            </Box>
          </Stack>

          <Box
            rounded="xl"
            bg={cardBg}
            p={8}
            shadow="lg"
            borderWidth="1px"
            borderColor={useColorModeValue('gray.200', 'gray.700')}
          >
            <form onSubmit={handleSubmit}>
              <Stack spacing={5}>
                <FormControl id="name" isRequired isInvalid={!!errors.name}>
                  <FormLabel>Full Name</FormLabel>
                  <InputGroup>
                    <Input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      size="lg"
                      pl={10}
                    />
                    <Icon
                      as={FiUser}
                      position="absolute"
                      left={3}
                      top="50%"
                      transform="translateY(-50%)"
                      color="gray.400"
                      boxSize={5}
                    />
                  </InputGroup>
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>

                <FormControl id="email" isRequired isInvalid={!!errors.email}>
                  <FormLabel>Email address</FormLabel>
                  <InputGroup>
                    <Input
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      size="lg"
                      pl={10}
                    />
                    <Icon
                      as={FiMail}
                      position="absolute"
                      left={3}
                      top="50%"
                      transform="translateY(-50%)"
                      color="gray.400"
                      boxSize={5}
                    />
                  </InputGroup>
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>

                <FormControl id="rollNumber" isRequired isInvalid={!!errors.rollNumber}>
                  <FormLabel>Roll Number</FormLabel>
                  <InputGroup>
                    <Input
                      type="text"
                      name="rollNumber"
                      placeholder="e.g., 2023001"
                      value={formData.rollNumber}
                      onChange={handleChange}
                      size="lg"
                      pl={10}
                    />
                    <Icon
                      as={FiHash}
                      position="absolute"
                      left={3}
                      top="50%"
                      transform="translateY(-50%)"
                      color="gray.400"
                      boxSize={5}
                    />
                  </InputGroup>
                  <FormHelperText>This will be your unique identifier</FormHelperText>
                  <FormErrorMessage>{errors.rollNumber}</FormErrorMessage>
                </FormControl>

                <FormControl id="role" isRequired>
                  <FormLabel>I am a</FormLabel>
                  <Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    size="lg"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                  </Select>
                </FormControl>

                <FormControl id="password" isRequired isInvalid={!!errors.password}>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      size="lg"
                      pl={10}
                    />
                    <Icon
                      as={FiLock}
                      position="absolute"
                      left={3}
                      top="50%"
                      transform="translateY(-50%)"
                      color="gray.400"
                      boxSize={5}
                    />
                    <InputRightElement h="100%" mr={2}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        _focus={{ boxShadow: 'none' }}
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormHelperText>Must be at least 6 characters</FormHelperText>
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>

                <FormControl id="confirmPassword" isRequired isInvalid={!!errors.confirmPassword}>
                  <FormLabel>Confirm Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      size="lg"
                      pl={10}
                    />
                    <Icon
                      as={FiLock}
                      position="absolute"
                      left={3}
                      top="50%"
                      transform="translateY(-50%)"
                      color="gray.400"
                      boxSize={5}
                    />
                    <InputRightElement h="100%" mr={2}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        _focus={{ boxShadow: 'none' }}
                      >
                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="brand"
                  size="lg"
                  width="full"
                  mt={4}
                  isLoading={loading}
                  loadingText="Creating account..."
                >
                  Sign Up
                </Button>

                <Divider my={2} />

                <Text textAlign="center" color={mutedTextColor}>
                  Already have an account?{' '}
                  <Link
                    as={RouterLink}
                    to="/login"
                    color="brand.500"
                    fontWeight="medium"
                  >
                    Sign in
                  </Link>
                </Text>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Container>
    </Flex>
  );
};

export default Signup;

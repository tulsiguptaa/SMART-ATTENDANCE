import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  Image,
  Icon,
  Divider,
  Link,
} from '@chakra-ui/react';
import { FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi';
import { useAuth } from '../context/Auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const { success, error } = await login(email, password);
      
      if (success) {
        // Success handled in useAuth hook
        navigate('/');
      } else {
        toast({
          title: 'Login Failed',
          description: error || 'Invalid email or password',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
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
  const textColor = useColorModeValue('gray.700', 'white');
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
                Welcome Back
              </Heading>
              <Text color={mutedTextColor}>
                Sign in to your QR Attendance Pro account
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
              <Stack spacing={6}>
                <FormControl id="email" isRequired>
                  <FormLabel>Email address</FormLabel>
                  <InputGroup>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
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
                </FormControl>

                <FormControl id="password" isRequired>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
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
                </FormControl>

                <Flex justify="flex-end">
                  <Link
                    as={RouterLink}
                    to="/forgot-password"
                    color="brand.500"
                    fontSize="sm"
                    fontWeight="medium"
                  >
                    Forgot password?
                  </Link>
                </Flex>

                <Button
                  type="submit"
                  colorScheme="brand"
                  size="lg"
                  width="full"
                  isLoading={loading}
                  loadingText="Signing in..."
                >
                  Sign In
                </Button>

                <Divider my={2} />

                <Text textAlign="center" color={mutedTextColor}>
                  Don't have an account?{' '}
                  <Link
                    as={RouterLink}
                    to="/signup"
                    color="brand.500"
                    fontWeight="medium"
                  >
                    Sign up
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

export default Login;

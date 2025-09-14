import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
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
  Stack,
  Text,
  useColorModeValue,
  useToast,
  Icon,
  Link,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { FiLock, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../context/Auth';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);
  
  const { validateResetToken, resetPassword } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // Validate the reset token on component mount
  useEffect(() => {
    const checkToken = async () => {
      try {
        setIsLoading(true);
        const { valid } = await validateResetToken(token);
        if (!valid) {
          setIsTokenValid(false);
        }
      } catch (error) {
        console.error('Token validation error:', error);
        setIsTokenValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      checkToken();
    } else {
      setIsTokenValid(false);
    }
  }, [token, validateResetToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error state
    setError('');
    
    // Validate form
    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { success, error: apiError } = await resetPassword(token, password);
      
      if (success) {
        setIsSuccess(true);
        
        // Show success toast
        toast({
          title: 'Password reset successful',
          description: 'Your password has been updated successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        throw new Error(apiError || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setError(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Gradient background colors
  const bgGradient = useColorModeValue(
    'linear(to-r, brand.50, blue.50)',
    'linear(to-r, gray.900, blue.900)'
  );

  const cardBg = useColorModeValue('white', 'gray.800');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.300');

  // Show loading state while checking token
  if (isLoading && !isTokenValid) {
    return (
      <Flex minH="100vh" align="center" justify="center" bgGradient={bgGradient}>
        <Container maxW="md" textAlign="center">
          <Text fontSize="lg" color={mutedTextColor}>
            Verifying reset link...
          </Text>
        </Container>
      </Flex>
    );
  }

  // Show error if token is invalid
  if (!isTokenValid) {
    return (
      <Flex minH="100vh" align="center" justify="center" bgGradient={bgGradient} p={4}>
        <Container maxW="md">
          <Box
            rounded="xl"
            bg={cardBg}
            p={8}
            shadow="lg"
            borderWidth="1px"
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            textAlign="center"
          >
            <Box
              w="80px"
              h="80px"
              borderRadius="full"
              bg="red.100"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mx="auto"
              mb={6}
            >
              <Icon as={FiLock} color="red.500" boxSize={8} />
            </Box>
            
            <Heading as="h1" size="xl" mb={4}>
              Invalid or Expired Link
            </Heading>
            
            <Text color={mutedTextColor} mb={6}>
              The password reset link is invalid or has expired. Please request a new one.
            </Text>
            
            <Button
              as={RouterLink}
              to="/forgot-password"
              colorScheme="brand"
              width="full"
              mt={4}
            >
              Request New Reset Link
            </Button>
            
            <Text mt={4} color={mutedTextColor}>
              <Link as={RouterLink} to="/login" color="brand.500" fontWeight="medium">
                Back to Login
              </Link>
            </Text>
          </Box>
        </Container>
      </Flex>
    );
  }

  // Show success state after password reset
  if (isSuccess) {
    return (
      <Flex minH="100vh" align="center" justify="center" bgGradient={bgGradient} p={4}>
        <Container maxW="md">
          <Box
            rounded="xl"
            bg={cardBg}
            p={8}
            shadow="lg"
            borderWidth="1px"
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            textAlign="center"
          >
            <Box
              w="80px"
              h="80px"
              borderRadius="full"
              bg="green.100"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mx="auto"
              mb={6}
            >
              <Icon as={FiCheckCircle} color="green.500" boxSize={8} />
            </Box>
            
            <Heading as="h1" size="xl" mb={4}>
              Password Updated!
            </Heading>
            
            <Text color={mutedTextColor} mb={6}>
              Your password has been successfully reset. You'll be redirected to the login page shortly.
            </Text>
            
            <Button
              as={RouterLink}
              to="/login"
              colorScheme="brand"
              width="full"
              mt={4}
            >
              Go to Login
            </Button>
          </Box>
        </Container>
      </Flex>
    );
  }

  // Show the password reset form
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
              <Box
                w="80px"
                h="80px"
                borderRadius="full"
                bg="brand.500"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mx="auto"
                mb={4}
              >
                <Icon as={FiLock} color="white" boxSize={8} />
              </Box>
              <Heading as="h1" size="xl" mb={2}>
                Create New Password
              </Heading>
              <Text color={mutedTextColor}>
                Enter a new password for your account
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
            {error && (
              <Alert status="error" mb={6} borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Box>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit}>
              <Stack spacing={5}>
                <FormControl id="password" isRequired>
                  <FormLabel>New Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      size="lg"
                      pl={12}
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
                        {showPassword ? 'Hide' : 'Show'}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <Text mt={2} fontSize="sm" color="gray.500">
                    Must be at least 6 characters
                  </Text>
                </FormControl>

                <FormControl id="confirmPassword" isRequired>
                  <FormLabel>Confirm New Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      size="lg"
                      pl={12}
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
                        {showConfirmPassword ? 'Hide' : 'Show'}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="brand"
                  size="lg"
                  width="full"
                  mt={4}
                  isLoading={isLoading}
                  loadingText="Updating password..."
                >
                  Update Password
                </Button>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Container>
    </Flex>
  );
};

export default ResetPassword;

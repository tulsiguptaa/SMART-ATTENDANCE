import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
  InputLeftElement,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  Icon,
  Link,
} from '@chakra-ui/react';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../context/Auth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      const { success, error: apiError } = await resetPassword(email);
      
      if (success) {
        setIsSubmitted(true);
        toast({
          title: 'Password reset email sent',
          description: 'Check your email for instructions to reset your password.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error(apiError || 'Failed to send password reset email');
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

  if (isSubmitted) {
    return (
      <Flex
        minH="100vh"
        align="center"
        justify="center"
        bgGradient={bgGradient}
        p={4}
      >
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
              mx="auto"
              w="80px"
              h="80px"
              borderRadius="full"
              bg="green.100"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb={6}
            >
              <Icon as={FiMail} color="green.500" boxSize={8} />
            </Box>
            
            <Heading as="h1" size="xl" mb={4}>
              Check Your Email
            </Heading>
            
            <Text color={mutedTextColor} mb={6}>
              We've sent a password reset link to <strong>{email}</strong>.
              Please check your inbox and follow the instructions to reset your password.
            </Text>
            
            <Text color={mutedTextColor} fontSize="sm" mb={6}>
              Didn't receive the email? Check your spam folder or{' '}
              <Button
                variant="link"
                colorScheme="brand"
                onClick={handleSubmit}
                isLoading={isLoading}
                p={0}
                height="auto"
                lineHeight="normal"
              >
                click here to resend
              </Button>.
            </Text>
            
            <Button
              as={RouterLink}
              to="/login"
              colorScheme="brand"
              variant="outline"
              width="full"
              leftIcon={<FiArrowLeft />}
            >
              Back to Login
            </Button>
          </Box>
        </Container>
      </Flex>
    );
  }

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
                Forgot Password?
              </Heading>
              <Text color={mutedTextColor}>
                Enter your email and we'll send you a link to reset your password
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
                <FormControl id="email" isInvalid={!!error}>
                  <FormLabel>Email address</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" h="100%" pl={3}>
                      <Icon as={FiMail} color="gray.400" boxSize={5} />
                    </InputLeftElement>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                      }}
                      size="lg"
                      pl={12}
                      autoFocus
                    />
                  </InputGroup>
                  <FormErrorMessage>{error}</FormErrorMessage>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="brand"
                  size="lg"
                  width="full"
                  isLoading={isLoading}
                  loadingText="Sending reset link..."
                >
                  Send Reset Link
                </Button>

                <Text textAlign="center" color={mutedTextColor}>
                  Remember your password?{' '}
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

export default ForgotPassword;

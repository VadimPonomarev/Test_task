import React, { useState } from "react";
import {
  Container,
  Box,
  Heading,
  Text,
  VStack,
  Input,
  Button,
  Card,
  Alert,
  Field,
  InputGroup,
  IconButton,
} from "@chakra-ui/react";
import { FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";
import { useLoginMutation } from "../services/api";

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading, error }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({
        username,
        password,
        expiresInMins: 30,
      }).unwrap();

      console.log("Login successful:", result);
      onLoginSuccess();
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <Container maxW="md" py={20}>
      <Card.Root>
        <Card.Body>
          <VStack>
            <Box textAlign="center">
              <Heading size="2xl" mb={2}>
                Добро пожаловать
              </Heading>
              <Text color="gray.600">
                Войдите в систему, чтобы получить доступ к панели управления.
              </Text>
            </Box>

            <Box as="form" onSubmit={handleSubmit} w="100%">
              <VStack>
                <Field.Root required>
                  <Field.Label>Имя пользователя</Field.Label>
                  <Input
                    placeholder="Введите имя пользователя"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Field.Root>

                <Field.Root required>
                  <Field.Label>Пароль</Field.Label>
                  <InputGroup
                    endElement={
                      <IconButton
                        size="xs"
                        variant="ghost"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                          showPassword ? "Скрыть пароль" : "Показать пароль"
                        }
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </IconButton>
                    }
                  >
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Введите пароль"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </InputGroup>
                </Field.Root>

                {error && (
                  <Alert.Root status="error">
                    <Alert.Indicator />
                    <Alert.Title>
                      {"data" in error
                        ? (error.data as any)?.message || "Ошибка входа"
                        : "Ошибка входа. Пожалуйста, проверьте свои учетные данные"}
                    </Alert.Title>
                  </Alert.Root>
                )}

                <Button
                  type="submit"
                  colorScheme="blue"
                  width="100%"
                  loading={isLoading}
                  loadingText="Signing in..."
                >
                  <FiLogIn style={{ marginRight: "8px" }} />
                  Войти
                </Button>
              </VStack>
            </Box>

            <Box textAlign="center" mt={4}>
              <Text fontSize="sm" color="gray.500">
                Учетные данные для демонстрации:
              </Text>
              <Text fontSize="xs" color="gray.400">
                Имя пользователя: emilys | Пароль: emilyspass
              </Text>
            </Box>
          </VStack>
        </Card.Body>
      </Card.Root>
    </Container>
  );
};

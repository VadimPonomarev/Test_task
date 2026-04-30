import React, { useState } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  Avatar,
  Button,
  Heading,
  Tabs,
  Spinner,
} from "@chakra-ui/react";
import {
  useGetUserCartsQuery,
  useGetUserPostsQuery,
  useGetUserTodosQuery,
} from "../services/api";
import type { User } from "../types/user";

interface SimpleUserDetailsDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SimpleUserDetailsDialog: React.FC<
  SimpleUserDetailsDialogProps
> = ({ user, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("basic");

  if (!isOpen || !user) return null;

  const { data: carts, isLoading: cartsLoading } = useGetUserCartsQuery(
    user.id,
    {
      skip: !isOpen || activeTab !== "carts",
    },
  );
  const { data: posts, isLoading: postsLoading } = useGetUserPostsQuery(
    user.id,
    {
      skip: !isOpen || activeTab !== "posts",
    },
  );
  const { data: todos, isLoading: todosLoading } = useGetUserTodosQuery(
    user.id,
    {
      skip: !isOpen || activeTab !== "todos",
    },
  );

  const renderBasicInfo = () => (
    <VStack align="stretch" h="100%">
      <Box>
        <Heading size="sm" mb={2} color="blue.600">
          Основная информация
        </Heading>
        <VStack align="start" pl={2}>
          <HStack justify="space-between" w="100%">
            <Text fontWeight="bold" w="120px">
              Имя пользователя:
            </Text>
            <Text flex={1}>{user.username}</Text>
          </HStack>
          <HStack justify="space-between" w="100%">
            <Text fontWeight="bold" w="120px">
              Электронная почта:
            </Text>
            <Text flex={1}>{user.email}</Text>
          </HStack>
          <HStack justify="space-between" w="100%">
            <Text fontWeight="bold" w="120px">
              Возраст:
            </Text>
            <Text flex={1}>{user.age} лет</Text>
          </HStack>
          <HStack justify="space-between" w="100%">
            <Text fontWeight="bold" w="120px">
              Пол:
            </Text>
            <Text flex={1}>
              {user.gender === "male" ? "Мужской" : "Женский"}
            </Text>
          </HStack>
          <HStack justify="space-between" w="100%">
            <Text fontWeight="bold" w="120px">
              Дата рождения:
            </Text>
            <Text flex={1}>{user.birthDate}</Text>
          </HStack>
          <HStack justify="space-between" w="100%">
            <Text fontWeight="bold" w="120px">
              Группа крови:
            </Text>
            <Badge colorScheme="red" flex={1} alignSelf="flex-start">
              {user.bloodGroup}
            </Badge>
          </HStack>
        </VStack>
      </Box>

      <Box>
        <Heading size="sm" mb={2} color="blue.600">
          Контактная информация
        </Heading>
        <VStack align="start" pl={2}>
          <HStack justify="space-between" w="100%">
            <Text fontWeight="bold" w="120px">
              Телефон:
            </Text>
            <Text flex={1}>{user.phone}</Text>
          </HStack>
          <Box w="100%">
            <Text fontWeight="bold" mb={1}>
              Адрес:
            </Text>
            <Text pl={2}>
              {user.address?.address}, {user.address?.city},{" "}
              {user.address?.state}, {user.address?.country}
            </Text>
          </Box>
        </VStack>
      </Box>

      <Box>
        <Heading size="sm" mb={2} color="blue.600">
          Рабочая информация
        </Heading>
        <VStack align="start" pl={2}>
          <HStack justify="space-between" w="100%">
            <Text fontWeight="bold" w="120px">
              Компания:
            </Text>
            <Text flex={1}>{user.company?.name}</Text>
          </HStack>
          <HStack justify="space-between" w="100%">
            <Text fontWeight="bold" w="120px">
              Отдел:
            </Text>
            <Badge colorScheme="blue" flex={1}>
              {user.company?.department}
            </Badge>
          </HStack>
          <HStack justify="space-between" w="100%">
            <Text fontWeight="bold" w="120px">
              Должность:
            </Text>
            <Text flex={1}>{user.company?.title}</Text>
          </HStack>
          <HStack justify="space-between" w="100%">
            <Text fontWeight="bold" w="120px">
              Университет:
            </Text>
            <Text flex={1}>{user.university}</Text>
          </HStack>
        </VStack>
      </Box>

      <Box>
        <Heading size="sm" mb={2} color="blue.600">
          Дополнительная информация
        </Heading>
        <VStack align="start" pl={2}>
          <HStack justify="space-between" w="100%">
            <Text fontWeight="bold" w="120px">
              Рост/Вес:
            </Text>
            <Text flex={1}>
              {user.height} см / {user.weight} кг
            </Text>
          </HStack>
          <HStack justify="space-between" w="100%">
            <Text fontWeight="bold" w="120px">
              Цвет глаз:
            </Text>
            <Text flex={1}>{user.eyeColor}</Text>
          </HStack>
          <HStack justify="space-between" w="100%">
            <Text fontWeight="bold" w="120px">
              Волосы:
            </Text>
            <Text flex={1}>
              {user.hair?.color} - {user.hair?.type}
            </Text>
          </HStack>
        </VStack>
      </Box>
    </VStack>
  );

  const renderCarts = () => {
    if (cartsLoading) {
      return (
        <Box
          textAlign="center"
          py={8}
          h="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner size="xl" />
        </Box>
      );
    }

    if (!carts?.carts?.length) {
      return (
        <Box
          textAlign="center"
          py={8}
          h="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="gray.500">Корзины не найдены</Text>
        </Box>
      );
    }

    return (
      <VStack align="stretch">
        {carts.carts.map((cart) => (
          <Box key={cart.id} p={4} borderWidth={1} borderRadius="md">
            <HStack justify="space-between" mb={2}>
              <Heading size="sm">Корзина #{cart.id}</Heading>
              <Badge colorScheme="green">${cart.total}</Badge>
            </HStack>
            <Text fontSize="sm">Со скидкой: ${cart.discountedTotal}</Text>
            <Text fontSize="sm">
              Товаров: {cart.totalProducts} ({cart.totalQuantity} шт.)
            </Text>
          </Box>
        ))}
      </VStack>
    );
  };

  const renderPosts = () => {
    if (postsLoading) {
      return (
        <Box
          textAlign="center"
          py={8}
          h="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner size="xl" />
        </Box>
      );
    }

    if (!posts?.posts?.length) {
      return (
        <Box
          textAlign="center"
          py={8}
          h="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="gray.500">Посты не найдены</Text>
        </Box>
      );
    }

    return (
      <VStack align="stretch">
        {posts.posts.map((post) => (
          <Box key={post.id} p={4} borderWidth={1} borderRadius="md">
            <Heading size="sm" mb={2}>
              {post.title}
            </Heading>
            <Text fontSize="sm" mb={2}>
              {post.body.substring(0, 150)}...
            </Text>
            <HStack flexWrap="wrap" gap={2}>
              <Badge colorScheme="blue">👍 {post.reactions.likes}</Badge>
              <Badge colorScheme="red">👎 {post.reactions.dislikes}</Badge>
              {post.tags.map((tag) => (
                <Badge key={tag} colorScheme="gray">
                  #{tag}
                </Badge>
              ))}
            </HStack>
          </Box>
        ))}
      </VStack>
    );
  };

  const renderTodos = () => {
    if (todosLoading) {
      return (
        <Box
          textAlign="center"
          py={8}
          h="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner size="xl" />
        </Box>
      );
    }

    if (!todos?.todos?.length) {
      return (
        <Box
          textAlign="center"
          py={8}
          h="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="gray.500">Задачи не найдены</Text>
        </Box>
      );
    }

    return (
      <VStack align="stretch">
        {todos.todos.map((todo) => (
          <Box
            key={todo.id}
            p={3}
            borderWidth={1}
            borderRadius="md"
            bg={todo.completed ? "green.50" : "yellow.50"}
          >
            <HStack flexWrap="wrap">
              <Badge colorScheme={todo.completed ? "green" : "yellow"}>
                {todo.completed ? "Выполнено" : "В ожидании"}
              </Badge>
              <Text>{todo.todo}</Text>
            </HStack>
          </Box>
        ))}
      </VStack>
    );
  };

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="blackAlpha.500"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={1000}
      onClick={onClose}
    >
      <Box
        bg="white"
        borderRadius="lg"
        p={6}
        maxW="800px"
        w="90%"
        h="auto"
        minH="95vh"
        overflow="auto"
        position="relative"
        onClick={(e) => e.stopPropagation()}
        display="flex"
        flexDirection="column"
      >
        <Button
          position="absolute"
          top={2}
          right={2}
          size="sm"
          variant="ghost"
          onClick={onClose}
        >
          ×
        </Button>

        <HStack mb={6}>
          <Avatar.Root size="lg">
            <Avatar.Image src={user.image} />
            <Avatar.Fallback name={`${user.firstName} ${user.lastName}`} />
          </Avatar.Root>
          <Box>
            <Heading size="lg">
              {user.firstName} {user.lastName}
            </Heading>
            <Text fontSize="sm" color="gray.500">
              @{user.username}
            </Text>
            <Badge
              colorScheme={
                user.role === "admin"
                  ? "red"
                  : user.role === "moderator"
                    ? "yellow"
                    : "green"
              }
            >
              {user.role === "admin"
                ? "Администратор"
                : user.role === "moderator"
                  ? "Модератор"
                  : "Пользователь"}
            </Badge>
          </Box>
        </HStack>

        <Tabs.Root
          value={activeTab}
          onValueChange={(e) => setActiveTab(e.value)}
          variant="enclosed"
          flex={1}
          display="flex"
          flexDirection="column"
        >
          <Tabs.List>
            <Tabs.Trigger value="basic">Основная информация</Tabs.Trigger>
            <Tabs.Trigger value="carts">Корзины</Tabs.Trigger>
            <Tabs.Trigger value="posts">Посты</Tabs.Trigger>
            <Tabs.Trigger value="todos">Задачи</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content
            value="basic"
            mt={4}
            flex={1}
            minH="350px"
            overflowY="auto"
          >
            {renderBasicInfo()}
          </Tabs.Content>

          <Tabs.Content
            value="carts"
            mt={4}
            flex={1}
            minH="350px"
            overflowY="auto"
          >
            {renderCarts()}
          </Tabs.Content>

          <Tabs.Content
            value="posts"
            mt={4}
            flex={1}
            minH="350px"
            overflowY="auto"
          >
            {renderPosts()}
          </Tabs.Content>

          <Tabs.Content
            value="todos"
            mt={4}
            flex={1}
            minH="350px"
            overflowY="auto"
          >
            {renderTodos()}
          </Tabs.Content>
        </Tabs.Root>

        <Button colorScheme="blue" onClick={onClose} width="100%" mt={6}>
          Закрыть
        </Button>
      </Box>
    </Box>
  );
};

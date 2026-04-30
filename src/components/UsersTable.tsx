import React from "react";
import {
  Table,
  Avatar,
  Badge,
  IconButton,
  HStack,
  Text,
  Input,
  Box,
  Flex,
  Field,
  InputGroup,
  Portal,
  Select,
  createListCollection,
  Button,
} from "@chakra-ui/react";
import {
  FiSearch,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
} from "react-icons/fi";
import type { User } from "../types/user";

interface UsersTableProps {
  users: User[];
  total: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onViewDetails: (user: User) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onAddUser: () => void;
  onSearch: (term: string) => void;
  onDepartmentFilter: (department: string) => void;
  departments: string[];
  searchTerm: string;
  departmentFilter: string;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  total,
  currentPage,
  itemsPerPage,
  onPageChange,
  onViewDetails,
  onEditUser,
  onDeleteUser,
  onAddUser,
  onSearch,
  onDepartmentFilter,
  departments,
  searchTerm,
  departmentFilter,
}) => {
  const totalPages = Math.ceil(total / itemsPerPage);

  const departmentCollection = React.useMemo(() => {
    const items = [
      { label: "Все отделы", value: "all" },
      ...departments.map((dept) => ({ label: dept, value: dept })),
    ];
    return createListCollection({ items });
  }, [departments]);

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Flex gap={4} flex={1}>
          <Field.Root flex={2}>
            <InputGroup startElement={<FiSearch />}>
              <Input
                placeholder="Поиск по имени, email или имени пользователя..."
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
              />
            </InputGroup>
          </Field.Root>

          <Field.Root w="250px">
            <Select.Root
              collection={departmentCollection}
              value={[departmentFilter]}
              onValueChange={(e) => onDepartmentFilter(e.value[0])}
              size="md"
            >
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Выберите отдел" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {departmentCollection.items.map((item) => (
                      <Select.Item item={item} key={item.value}>
                        {item.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </Field.Root>
        </Flex>

        <Button colorScheme="blue" onClick={onAddUser} ml={4}>
          <FiPlus style={{ marginRight: "8px" }} />
          Добавить пользователя
        </Button>
      </Flex>

      <Table.Root variant="outline" size="md">
        <Table.Header>
          <Table.Row bg="gray.50">
            <Table.ColumnHeader>Пользователь</Table.ColumnHeader>
            <Table.ColumnHeader>Контакты</Table.ColumnHeader>
            <Table.ColumnHeader>Отдел</Table.ColumnHeader>
            <Table.ColumnHeader>Роль</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="center">Действия</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users.map((user) => (
            <Table.Row key={user.id} _hover={{ bg: "gray.50" }}>
              <Table.Cell>
                <HStack>
                  <Avatar.Root size="sm">
                    <Avatar.Image src={user.image} />
                    <Avatar.Fallback
                      name={`${user.firstName} ${user.lastName}`}
                    />
                  </Avatar.Root>
                  <Box>
                    <Text fontWeight="medium">
                      {user.firstName} {user.lastName}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      @{user.username}
                    </Text>
                  </Box>
                </HStack>
              </Table.Cell>
              <Table.Cell>
                <Box>
                  <Text fontSize="sm">{user.email}</Text>
                  <Text fontSize="xs" color="gray.500">
                    {user.phone}
                  </Text>
                </Box>
              </Table.Cell>
              <Table.Cell>
                <Badge colorScheme="blue">{user.company.department}</Badge>
              </Table.Cell>
              <Table.Cell>
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
              </Table.Cell>
              <Table.Cell textAlign="center">
                <HStack justify="center">
                  <IconButton
                    aria-label="Просмотр деталей"
                    size="sm"
                    variant="ghost"
                    onClick={() => onViewDetails(user)}
                  >
                    <FiEye />
                  </IconButton>
                  <IconButton
                    aria-label="Редактировать пользователя"
                    size="sm"
                    variant="ghost"
                    colorScheme="yellow"
                    onClick={() => onEditUser(user)}
                  >
                    <FiEdit2 />
                  </IconButton>
                  <IconButton
                    aria-label="Удалить пользователя"
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => onDeleteUser(user)}
                  >
                    <FiTrash2 />
                  </IconButton>
                </HStack>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {totalPages > 1 && (
        <Flex justify="center" gap={2} mt={6}>
          <IconButton
            aria-label="Предыдущая страница"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FiChevronLeft />
          </IconButton>

          <HStack>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <Button
                  key={pageNum}
                  size="sm"
                  variant={currentPage === pageNum ? "solid" : "outline"}
                  colorScheme={currentPage === pageNum ? "blue" : "gray"}
                  onClick={() => onPageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </HStack>

          <IconButton
            aria-label="Следующая страница"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <FiChevronRight />
          </IconButton>
        </Flex>
      )}
    </Box>
  );
};

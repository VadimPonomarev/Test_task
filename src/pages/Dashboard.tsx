import React, { useState, useCallback, useMemo } from "react";
import {
  Container,
  Box,
  Heading,
  Text,
  SimpleGrid,
  Card,
  Spinner,
  Flex,
  useDisclosure,
  Alert,
  HStack,
  Button,
  Avatar,
  Menu,
} from "@chakra-ui/react";
import { FiLogOut, FiUser } from "react-icons/fi";
import {
  useGetUsersQuery,
  useSearchUsersQuery,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useDeleteUserMutation,
} from "../services/api";
import { UsersTable } from "../components/UsersTable";
import type { User, DashboardStats } from "../types/user";
import { SimpleUserDetailsDialog } from "../components/SimpleUserDetailsDialog";
import { UserForm } from "../components/UserForm";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { toaster } from "../components/ui/toaster";

interface DashboardProps {
  onLogout?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const {
    open: detailsOpen,
    onOpen: onDetailsOpen,
    onClose: onDetailsClose,
  } = useDisclosure();
  const {
    open: formOpen,
    onOpen: onFormOpen,
    onClose: onFormClose,
  } = useDisclosure();
  const {
    open: deleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [logout] = useLogoutMutation();

  const itemsPerPage = 10;

  const { data, isLoading, error, refetch } = useGetUsersQuery({
    limit: itemsPerPage,
    skip: (currentPage - 1) * itemsPerPage,
  });

  const { data: searchResults, isLoading: isSearching } = useSearchUsersQuery(
    searchTerm,
    { skip: searchTerm.length < 2 },
  );

  const { data: currentUserData, isLoading: isUserLoading } =
    useGetCurrentUserQuery(undefined, {
      skip: !localStorage.getItem("accessToken"),
    });

  const selectedUser = useMemo(() => {
    if (!selectedUserId) return null;
    return data?.users.find((u) => u.id === selectedUserId) || null;
  }, [selectedUserId, data?.users]);

  const stats = useMemo<DashboardStats | null>(() => {
    if (!data?.users) return null;
    const users = data.users;
    const maleCount = users.filter((u) => u.gender === "male").length;
    const femaleCount = users.filter((u) => u.gender === "female").length;
    const avgAge = Math.round(
      users.reduce((sum, u) => sum + u.age, 0) / users.length,
    );
    const departments = [...new Set(users.map((u) => u.company.department))];
    return {
      total: data.total,
      male: maleCount,
      female: femaleCount,
      avgAge,
      departments,
    };
  }, [data]);

  const displayedUsers = useMemo(() => {
    let users =
      searchTerm.length >= 2 && searchResults
        ? searchResults.users
        : data?.users || [];
    if (departmentFilter !== "all") {
      users = users.filter((u) => u.company.department === departmentFilter);
    }
    return users;
  }, [data?.users, searchResults, searchTerm, departmentFilter]);

  const handleViewDetails = useCallback(
    (user: User) => {
      setSelectedUserId(user.id);
      onDetailsOpen();
    },
    [onDetailsOpen],
  );

  const handleCloseDialog = useCallback(() => {
    onDetailsClose();
    setSelectedUserId(null);
  }, [onDetailsClose]);

  const handleEditUser = useCallback(
    (user: User) => {
      setUserToEdit(user);
      onFormOpen();
    },
    [onFormOpen],
  );

  const handleAddUser = useCallback(() => {
    setUserToEdit(null);
    onFormOpen();
  }, [onFormOpen]);

  const handleDeleteUser = useCallback(
    (user: User) => {
      setUserToDelete(user);
      onDeleteOpen();
    },
    [onDeleteOpen],
  );

  const confirmDelete = useCallback(async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete.id).unwrap();
      toaster.create({
        title: "Пользователь удален",
        description: `${userToDelete.firstName} ${userToDelete.lastName} был удален.`,
        type: "success",
      });
      refetch();
      onDeleteClose();
      setUserToDelete(null);
    } catch (error) {
      toaster.create({
        title: "Ошибка",
        description: "Не удалось удалить пользователя",
        type: "error",
      });
    }
  }, [userToDelete, deleteUser, refetch, onDeleteClose]);

  const handleFormSuccess = useCallback(() => {
    toaster.create({
      title: userToEdit ? "Пользователь обновлен" : "Пользователь добавлен",
      description: userToEdit
        ? `${userToEdit.firstName} ${userToEdit.lastName} был обновлен.`
        : "Новый пользователь был добавлен.",
      type: "success",
    });
    refetch();
    onFormClose();
    setUserToEdit(null);
  }, [userToEdit, refetch, onFormClose]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  const handleDepartmentFilter = useCallback((department: string) => {
    setDepartmentFilter(department);
    setCurrentPage(1);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await logout().unwrap();
      toaster.create({
        title: "Выход выполнен",
        description: "Вы успешно вышли из системы.",
        type: "info",
      });
      if (onLogout) onLogout();
    } catch (error) {
      console.error("Ошибка выхода:", error);
      if (onLogout) onLogout();
    }
  }, [logout, onLogout]);

  if (isLoading || isUserLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Title>
            Не удалось загрузить пользователей. Пожалуйста, попробуйте позже.
          </Alert.Title>
          <Button size="sm" onClick={() => refetch()} mt={4}>
            Повторить
          </Button>
        </Alert.Root>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Flex justify="space-between" align="center" mb={8}>
        <Box>
          <Heading size="4xl" mb={2}>
            Панель управления пользователями
          </Heading>
          <Text color="gray.600">
            Управление и анализ данных пользователей.
          </Text>
        </Box>

        <HStack>
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button variant="ghost" size="sm">
                <HStack>
                  <Avatar.Root size="sm">
                    <Avatar.Image src={currentUserData?.image} />
                    <Avatar.Fallback
                      name={currentUserData?.firstName || "Пользователь"}
                    />
                  </Avatar.Root>
                  <Text display={{ base: "none", md: "block" }}>
                    {currentUserData?.firstName} {currentUserData?.lastName}
                  </Text>
                </HStack>
              </Button>
            </Menu.Trigger>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="profile" disabled>
                  <FiUser style={{ marginRight: "8px" }} />
                  Профиль
                </Menu.Item>
                <Menu.Item value="logout" onClick={handleLogout}>
                  <FiLogOut style={{ marginRight: "8px" }} />
                  Выход
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>
        </HStack>
      </Flex>

      {stats && (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} mb={8}>
          <Card.Root>
            <Card.Body>
              <Text fontSize="sm" color="gray.500" mb={1}>
                Всего пользователей
              </Text>
              <Heading size="3xl" mb={1}>
                {stats.total}
              </Heading>
              <Text fontSize="sm" color="gray.500">
                из базы данных
              </Text>
            </Card.Body>
          </Card.Root>
          <Card.Root>
            <Card.Body>
              <Text fontSize="sm" color="gray.500" mb={1}>
                Соотношение полов
              </Text>
              <Heading size="3xl" mb={1}>
                {stats.male} / {stats.female}
              </Heading>
              <Text fontSize="sm" color="gray.500">
                Мужской / Женский
              </Text>
            </Card.Body>
          </Card.Root>
          <Card.Root>
            <Card.Body>
              <Text fontSize="sm" color="gray.500" mb={1}>
                Средний возраст
              </Text>
              <Heading size="3xl" mb={1}>
                {stats.avgAge}
              </Heading>
              <Text fontSize="sm" color="gray.500">
                лет
              </Text>
            </Card.Body>
          </Card.Root>
          <Card.Root>
            <Card.Body>
              <Text fontSize="sm" color="gray.500" mb={1}>
                Отделы
              </Text>
              <Heading size="3xl" mb={1}>
                {stats.departments.length}
              </Heading>
              <Text fontSize="sm" color="gray.500">
                уникальных отделов
              </Text>
            </Card.Body>
          </Card.Root>
        </SimpleGrid>
      )}

      {isSearching ? (
        <Flex justify="center" py={12}>
          <Spinner size="xl" />
        </Flex>
      ) : (
        <UsersTable
          users={displayedUsers}
          total={
            searchTerm.length >= 2
              ? searchResults?.total || 0
              : data?.total || 0
          }
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onViewDetails={handleViewDetails}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
          onAddUser={handleAddUser}
          onSearch={handleSearch}
          onDepartmentFilter={handleDepartmentFilter}
          departments={stats?.departments || []}
          searchTerm={searchTerm}
          departmentFilter={departmentFilter}
        />
      )}

      {/* Диалог просмотра деталей */}
      {detailsOpen && selectedUser && (
        <SimpleUserDetailsDialog
          user={selectedUser}
          isOpen={detailsOpen}
          onClose={handleCloseDialog}
        />
      )}

      <UserForm
        isOpen={formOpen}
        onClose={onFormClose}
        user={userToEdit}
        onSuccess={handleFormSuccess}
      />
      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={onDeleteClose}
        onConfirm={confirmDelete}
        title="Удаление пользователя"
        message={`Вы уверены, что хотите удалить ${userToDelete?.firstName} ${userToDelete?.lastName}? Это действие нельзя отменить.`}
        isLoading={isDeleting}
      />
    </Container>
  );
};

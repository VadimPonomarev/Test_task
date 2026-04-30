import React, { useEffect } from "react";
import {
  Dialog,
  Portal,
  Button,
  CloseButton,
  VStack,
  HStack,
  Text,
  Input,
  Field,
  Select,
  createListCollection,
  NumberInput,
  Box,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { useAddUserMutation, useUpdateUserMutation } from "../services/api";
import type { User } from "../types/user";

interface UserFormData {
  firstName: string;
  lastName: string;
  maidenName?: string;
  username: string;
  password?: string;
  email: string;
  phone?: string;
  age: number;
  gender: "male" | "female";
  bloodGroup?: string;
  height?: number;
  weight?: number;
  eyeColor?: string;
  hair?: {
    color?: string;
    type?: string;
  };
  university?: string;
  address?: {
    address?: string;
    city?: string;
    state?: string;
    stateCode?: string;
    postalCode?: string;
    country?: string;
  };
  company?: {
    department?: string;
    name?: string;
    title?: string;
  };
  role?: "admin" | "moderator" | "user";
}

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
  onSuccess: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({
  isOpen,
  onClose,
  user,
  onSuccess,
}) => {
  const [addUser, { isLoading: isAdding }] = useAddUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const isEditing = !!user;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      maidenName: "",
      username: "",
      password: "",
      email: "",
      phone: "",
      age: 0,
      gender: "male",
      bloodGroup: "O+",
      height: 0,
      weight: 0,
      eyeColor: "",
      hair: {
        color: "",
        type: "",
      },
      university: "",
      address: {
        address: "",
        city: "",
        state: "",
        stateCode: "",
        postalCode: "",
        country: "United States",
      },
      company: {
        department: "",
        name: "",
        title: "",
      },
      role: "user",
    },
  });

  useEffect(() => {
    if (user && isOpen) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        maidenName: user.maidenName || "",
        username: user.username || "",
        password: "",
        email: user.email || "",
        phone: user.phone || "",
        age: user.age || 0,
        gender: user.gender as "male" | "female",
        bloodGroup: user.bloodGroup || "O+",
        height: user.height || 0,
        weight: user.weight || 0,
        eyeColor: user.eyeColor || "",
        hair: {
          color: user.hair?.color || "",
          type: user.hair?.type || "",
        },
        university: user.university || "",
        address: {
          address: user.address?.address || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          stateCode: user.address?.stateCode || "",
          postalCode: user.address?.postalCode || "",
          country: user.address?.country || "United States",
        },
        company: {
          department: user.company?.department || "",
          name: user.company?.name || "",
          title: user.company?.title || "",
        },
        role: user.role || "user",
      });
    } else if (!isOpen) {
      reset();
    }
  }, [user, isOpen, reset]);

  const onSubmit = async (data: UserFormData) => {
    try {
      const cleanedData = Object.fromEntries(
        Object.entries(data).filter(
          ([_, value]) => value !== "" && value !== null && value !== undefined,
        ),
      );

      if (isEditing && user) {
        await updateUser({ id: user.id, data: cleanedData }).unwrap();
      } else {
        await addUser(cleanedData).unwrap();
      }
      onSuccess();
      onClose();
      reset();
    } catch (error) {
      console.error("Failed to save user:", error);
    }
  };

  const genderCollection = createListCollection({
    items: [
      { label: "Мужской", value: "male" },
      { label: "Женский", value: "female" },
    ],
  });

  const bloodGroupCollection = createListCollection({
    items: [
      { label: "A+", value: "A+" },
      { label: "A-", value: "A-" },
      { label: "B+", value: "B+" },
      { label: "B-", value: "B-" },
      { label: "O+", value: "O+" },
      { label: "O-", value: "O-" },
      { label: "AB+", value: "AB+" },
      { label: "AB-", value: "AB-" },
    ],
  });

  const roleCollection = createListCollection({
    items: [
      { label: "Пользователь", value: "user" },
      { label: "Модератор", value: "moderator" },
      { label: "Администратор", value: "admin" },
    ],
  });

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      size="lg"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Dialog.Header>
                <Dialog.Title>
                  {isEditing
                    ? "Редактировать пользователя"
                    : "Добавить пользователя"}
                </Dialog.Title>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Dialog.CloseTrigger>
              </Dialog.Header>

              <Dialog.Body>
                <VStack maxH="60vh" overflowY="auto" px={2}>
                  <Box w="100%">
                    <Text fontWeight="bold" mb={2}>
                      Основная информация
                    </Text>
                    <HStack w="100%">
                      <Field.Root flex={1} invalid={!!errors.firstName}>
                        <Field.Label>Имя *</Field.Label>
                        <Controller
                          name="firstName"
                          control={control}
                          rules={{ required: "Имя обязательно" }}
                          render={({ field }) => <Input {...field} />}
                        />
                        {errors.firstName && (
                          <Field.ErrorText>
                            {errors.firstName.message}
                          </Field.ErrorText>
                        )}
                      </Field.Root>

                      <Field.Root flex={1} invalid={!!errors.lastName}>
                        <Field.Label>Фамилия *</Field.Label>
                        <Controller
                          name="lastName"
                          control={control}
                          rules={{ required: "Фамилия обязательна" }}
                          render={({ field }) => <Input {...field} />}
                        />
                        {errors.lastName && (
                          <Field.ErrorText>
                            {errors.lastName.message}
                          </Field.ErrorText>
                        )}
                      </Field.Root>
                    </HStack>

                    <Field.Root mt={3} invalid={!!errors.maidenName}>
                      <Field.Label>Девичья фамилия</Field.Label>
                      <Controller
                        name="maidenName"
                        control={control}
                        render={({ field }) => <Input {...field} />}
                      />
                    </Field.Root>
                  </Box>

                  <Box w="100%">
                    <Text fontWeight="bold" mb={2}>
                      Учетная запись
                    </Text>
                    <HStack w="100%">
                      <Field.Root flex={1} invalid={!!errors.username}>
                        <Field.Label>Имя пользователя *</Field.Label>
                        <Controller
                          name="username"
                          control={control}
                          rules={{
                            required: "Имя пользователя обязательно",
                            minLength: {
                              value: 3,
                              message:
                                "Имя пользователя должно содержать минимум 3 символа",
                            },
                          }}
                          render={({ field }) => <Input {...field} />}
                        />
                        {errors.username && (
                          <Field.ErrorText>
                            {errors.username.message}
                          </Field.ErrorText>
                        )}
                      </Field.Root>

                      <Field.Root flex={1} invalid={!!errors.password}>
                        <Field.Label>Пароль {!isEditing && "*"}</Field.Label>
                        <Controller
                          name="password"
                          control={control}
                          rules={
                            !isEditing
                              ? {
                                  required: "Пароль обязателен",
                                  minLength: {
                                    value: 4,
                                    message:
                                      "Пароль должен содержать минимум 4 символа",
                                  },
                                }
                              : {}
                          }
                          render={({ field }) => (
                            <Input type="password" {...field} />
                          )}
                        />
                        {errors.password && (
                          <Field.ErrorText>
                            {errors.password.message}
                          </Field.ErrorText>
                        )}
                      </Field.Root>
                    </HStack>
                  </Box>

                  <Box w="100%">
                    <Text fontWeight="bold" mb={2}>
                      Контактная информация
                    </Text>
                    <VStack>
                      <Field.Root w="100%" invalid={!!errors.email}>
                        <Field.Label>Электронная почта *</Field.Label>
                        <Controller
                          name="email"
                          control={control}
                          rules={{
                            required: "Электронная почта обязательна",
                            pattern: {
                              value: /^\S+@\S+$/i,
                              message: "Неверный формат электронной почты",
                            },
                          }}
                          render={({ field }) => (
                            <Input type="email" {...field} />
                          )}
                        />
                        {errors.email && (
                          <Field.ErrorText>
                            {errors.email.message}
                          </Field.ErrorText>
                        )}
                      </Field.Root>

                      <Field.Root w="100%">
                        <Field.Label>Телефон</Field.Label>
                        <Controller
                          name="phone"
                          control={control}
                          render={({ field }) => <Input {...field} />}
                        />
                      </Field.Root>
                    </VStack>
                  </Box>

                  <Box w="100%">
                    <Text fontWeight="bold" mb={2}>
                      Личная информация
                    </Text>
                    <HStack w="100%">
                      <Field.Root flex={1} invalid={!!errors.age}>
                        <Field.Label>Возраст</Field.Label>
                        <Controller
                          name="age"
                          control={control}
                          rules={{
                            min: {
                              value: 0,
                              message: "Возраст должен быть положительным",
                            },
                            max: {
                              value: 150,
                              message: "Возраст должен быть меньше 150",
                            },
                          }}
                          render={({ field }) => (
                            <NumberInput.Root
                              value={field.value.toString()}
                              onValueChange={(e) =>
                                field.onChange(parseInt(e.value))
                              }
                              min={0}
                              max={150}
                            >
                              <NumberInput.Control />
                              <NumberInput.Input />
                            </NumberInput.Root>
                          )}
                        />
                        {errors.age && (
                          <Field.ErrorText>
                            {errors.age.message}
                          </Field.ErrorText>
                        )}
                      </Field.Root>

                      <Field.Root flex={1}>
                        <Field.Label>Пол</Field.Label>
                        <Controller
                          name="gender"
                          control={control}
                          render={({ field }) => (
                            <Select.Root
                              collection={genderCollection}
                              value={[field.value]}
                              onValueChange={(e) => field.onChange(e.value[0])}
                            >
                              <Select.Control>
                                <Select.Trigger>
                                  <Select.ValueText placeholder="Выберите пол" />
                                </Select.Trigger>
                              </Select.Control>
                              <Portal>
                                <Select.Positioner>
                                  <Select.Content>
                                    {genderCollection.items.map((item) => (
                                      <Select.Item item={item} key={item.value}>
                                        {item.label}
                                      </Select.Item>
                                    ))}
                                  </Select.Content>
                                </Select.Positioner>
                              </Portal>
                            </Select.Root>
                          )}
                        />
                      </Field.Root>
                    </HStack>

                    <HStack w="100%" mt={3}>
                      <Field.Root flex={1}>
                        <Field.Label>Группа крови</Field.Label>
                        <Controller
                          name="bloodGroup"
                          control={control}
                          render={({ field }) => (
                            <Select.Root
                              collection={bloodGroupCollection}
                              value={[field.value || "O+"]}
                              onValueChange={(e) => field.onChange(e.value[0])}
                            >
                              <Select.Control>
                                <Select.Trigger>
                                  <Select.ValueText placeholder="Выберите группу крови" />
                                </Select.Trigger>
                              </Select.Control>
                              <Portal>
                                <Select.Positioner>
                                  <Select.Content>
                                    {bloodGroupCollection.items.map((item) => (
                                      <Select.Item item={item} key={item.value}>
                                        {item.label}
                                      </Select.Item>
                                    ))}
                                  </Select.Content>
                                </Select.Positioner>
                              </Portal>
                            </Select.Root>
                          )}
                        />
                      </Field.Root>

                      <Field.Root flex={1}>
                        <Field.Label>Роль</Field.Label>
                        <Controller
                          name="role"
                          control={control}
                          render={({ field }) => (
                            <Select.Root
                              collection={roleCollection}
                              value={[field.value || "user"]}
                              onValueChange={(e) => field.onChange(e.value[0])}
                            >
                              <Select.Control>
                                <Select.Trigger>
                                  <Select.ValueText placeholder="Выберите роль" />
                                </Select.Trigger>
                              </Select.Control>
                              <Portal>
                                <Select.Positioner>
                                  <Select.Content>
                                    {roleCollection.items.map((item) => (
                                      <Select.Item item={item} key={item.value}>
                                        {item.label}
                                      </Select.Item>
                                    ))}
                                  </Select.Content>
                                </Select.Positioner>
                              </Portal>
                            </Select.Root>
                          )}
                        />
                      </Field.Root>
                    </HStack>

                    <Field.Root mt={3}>
                      <Field.Label>Университет</Field.Label>
                      <Controller
                        name="university"
                        control={control}
                        render={({ field }) => <Input {...field} />}
                      />
                    </Field.Root>
                  </Box>

                  <Box w="100%">
                    <Text fontWeight="bold" mb={2}>
                      Адрес
                    </Text>
                    <VStack>
                      <Field.Root w="100%">
                        <Field.Label>Адрес (улица)</Field.Label>
                        <Controller
                          name="address.address"
                          control={control}
                          render={({ field }) => <Input {...field} />}
                        />
                      </Field.Root>

                      <HStack w="100%">
                        <Field.Root flex={1}>
                          <Field.Label>Город</Field.Label>
                          <Controller
                            name="address.city"
                            control={control}
                            render={({ field }) => <Input {...field} />}
                          />
                        </Field.Root>

                        <Field.Root flex={1}>
                          <Field.Label>Регион/Область</Field.Label>
                          <Controller
                            name="address.state"
                            control={control}
                            render={({ field }) => <Input {...field} />}
                          />
                        </Field.Root>
                      </HStack>

                      <HStack w="100%">
                        <Field.Root flex={1}>
                          <Field.Label>Код региона</Field.Label>
                          <Controller
                            name="address.stateCode"
                            control={control}
                            render={({ field }) => <Input {...field} />}
                          />
                        </Field.Root>

                        <Field.Root flex={1}>
                          <Field.Label>Почтовый индекс</Field.Label>
                          <Controller
                            name="address.postalCode"
                            control={control}
                            render={({ field }) => <Input {...field} />}
                          />
                        </Field.Root>
                      </HStack>

                      <Field.Root w="100%">
                        <Field.Label>Страна</Field.Label>
                        <Controller
                          name="address.country"
                          control={control}
                          render={({ field }) => <Input {...field} />}
                        />
                      </Field.Root>
                    </VStack>
                  </Box>

                  <Box w="100%">
                    <Text fontWeight="bold" mb={2}>
                      Информация о компании
                    </Text>
                    <VStack>
                      <Field.Root w="100%">
                        <Field.Label>Название компании</Field.Label>
                        <Controller
                          name="company.name"
                          control={control}
                          render={({ field }) => <Input {...field} />}
                        />
                      </Field.Root>

                      <HStack w="100%">
                        <Field.Root flex={1}>
                          <Field.Label>Отдел</Field.Label>
                          <Controller
                            name="company.department"
                            control={control}
                            render={({ field }) => <Input {...field} />}
                          />
                        </Field.Root>

                        <Field.Root flex={1}>
                          <Field.Label>Должность</Field.Label>
                          <Controller
                            name="company.title"
                            control={control}
                            render={({ field }) => <Input {...field} />}
                          />
                        </Field.Root>
                      </HStack>
                    </VStack>
                  </Box>
                </VStack>
              </Dialog.Body>

              <Dialog.Footer>
                <Button variant="outline" onClick={onClose}>
                  Отмена
                </Button>
                <Button
                  type="submit"
                  colorScheme="blue"
                  loading={isAdding || isUpdating || isSubmitting}
                >
                  {isEditing ? "Обновить" : "Добавить"} пользователя
                </Button>
              </Dialog.Footer>
            </form>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

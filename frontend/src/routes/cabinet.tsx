import { Container, Text, Box, Button, VStack, HStack, Avatar } from "@chakra-ui/react";
import { createFileRoute } from '@tanstack/react-router';
import { LoginService } from "../client";

type InterviewHistory = {
  date: string;
  summary: string;
  rating: number;
};

type UserProfileProps = {
  role: "interviewer" | "candidate" | "hr";
  name: string;
  photo: string;
  email: string;
  phone: string;
  rating?: number;
  availableSlots?: string[];
  interviewHistory: InterviewHistory[];
  onSlotUpdate: () => void;  // Для собеседующего
  onSignUp: () => void;      // Для соискателя
};

export const UserProfile: React.FC<UserProfileProps> = ({
  role,
  name,
  photo,
  email,
  phone,
  rating,
  availableSlots,
  interviewHistory,
  onSlotUpdate,
  onSignUp
}) => {
  return (
    <Box width="100%" padding={4}>
      <VStack spacing={4} align="center">
        <Avatar name={name} src={photo} size="xl" />
        <Text fontSize="xl" fontWeight="bold">{name}</Text>
        <Text color="gray.500">{email}</Text>
        <Text color="gray.500">{phone}</Text>

        {role === "candidate" && (
          <>
            <Text fontSize="lg">Средняя оценка: {rating}</Text>
            <Text color="green.500">Статус: в активном поиске</Text>
          </>
        )}

        {role === "interviewer" && (
          <>
            <Text fontSize="lg">Количество собеседований: {interviewHistory.length}</Text>
            <Box>
              <Text fontWeight="bold">Свободные слоты:</Text>
              {availableSlots && availableSlots.length > 0 ? (
                <Text>{availableSlots.join(", ")}</Text>
              ) : (
                <Text color="red.500">Нет доступных слотов</Text>
              )}
            </Box>
          </>
        )}

        <HStack spacing={4}>
          {role === "interviewer" && (
            <Button colorScheme="blue" onClick={onSlotUpdate}>Указать свободные слоты</Button>
          )}
          {role === "candidate" && (
            <Button colorScheme="green" onClick={onSignUp}>Записаться на интервью</Button>
          )}
        </HStack>
      </VStack>

      <Box mt={8}>
        <Text fontSize="lg" fontWeight="bold">История собеседований</Text>
        <VStack spacing={4} align="stretch">
          {interviewHistory.map((history, index) => (
            <Box key={index} borderWidth="1px" borderRadius="md" p={4}>
              <Text fontSize="md">Собеседование от {history.date}</Text>
              <Text color="gray.600">{history.summary}</Text>
              <Text fontWeight="bold">Оценка: {history.rating}</Text>
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  );
};

type CabinetPageProps = {
  role: "interviewer" | "candidate" | "hr";
  userData?: {
    name: string;
    photo: string;
    email: string;
    phone: string;
    rating?: number;
    availableSlots?: string[];
    interviewHistory: InterviewHistory[];
  };
  onSlotUpdate: () => void;
  onSignUp: () => void;
};

export const CabinetPage: React.FC<CabinetPageProps> = ({
  role = "candidate",
  userData = {
    name: "Владислав",
    photo: "photo",
    email: "vladislav@gmail.com",
    phone: "8-921-740-15-19",
    rating: 999,
    availableSlots: [
      "first",
      "second"
    ],
    interviewHistory: [
        {
         date: "07.11.2024",
         summary: "summary",
         rating: 10   
        }
    ]
  },
  onSlotUpdate,
  onSignUp
}) => {

  const recoverPassword = async () => {
    await LoginService.recoverPassword({
      email: "",
    })
  }
  recoverPassword();
  return (
    <Container maxW="container.sm" centerContent>
      <UserProfile
        role={role}
        name={userData.name}
        photo={userData.photo}
        email={userData.email}
        phone={userData.phone}
        rating={userData.rating}
        availableSlots={userData.availableSlots}
        interviewHistory={userData.interviewHistory}
        onSlotUpdate={onSlotUpdate}
        onSignUp={onSignUp}
      />
    </Container>
  );
};

export const Route = createFileRoute('/cabinet')({
  component: CabinetPage,
//   beforeLoad: async () => {
//     // Check access for users
//   },
});

import { createFileRoute } from "@tanstack/react-router"
import {
  Container,
  Badge,
  Text,
  VStack,
  StackDivider,
  HStack,
  Heading,
  Divider,
  Image
} from '@chakra-ui/react';
import useAuth from "../../hooks/useAuth"
import ProfileIcon from '../../../public/assets/images/cat.jpg'

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
})

function Dashboard() {
  const { user: currentUser } = useAuth()

  const userData = {
    technologies: [
      { name: 'algo', count: 5 },
      { name: 'c++', count: 3 },
      { name: 'go', count: 4 },
      { name: 'python', count: 2 },
    ],
    lastInterview: '2024-11-06',
    nextInterviews: [
      { date: '2024-11-08', tech: 'algo' },
      { date: '2024-11-10', tech: 'python' },
    ],
  };

  return (
    <Container maxW="full">
       <Heading size="lg" textAlign={{ base: "center", md: "left" }} py={12}>
        Profile
      </Heading>

      <HStack spacing={5} align="center">
        <Image 
          borderRadius="full"
          boxSize="100px"
          src={ProfileIcon}
          alt="Profile Photo" 
        />
        <VStack align="start">
          <Text fontSize="lg">{currentUser?.full_name}</Text>
          <Text fontSize="lg">{currentUser?.email}</Text>
        </VStack>
      </HStack>
      
      <Divider my={4} />

      <Text fontSize="lg" fontWeight="bold">{currentUser?.role}</Text>

      <Divider my={4} />

      <Text fontSize="lg" fontWeight="bold">
        Preferred Stack:
      </Text>
      <VStack align="start" divider={<StackDivider borderColor="gray.200" />}>
        {userData.technologies
          .sort((a, b) => b.count - a.count)
          .map((tech) => (
            <HStack key={tech.name}>
              <Badge colorScheme="blue">{tech.name}</Badge>
              <Text>{tech.count}</Text>
            </HStack>
          ))}
      </VStack>

      <Divider my={4} />

      <VStack align="start" spacing={4} mt={5}>
        <Text fontSize="lg" fontWeight="bold">
        Last interview:
        </Text>
        <Text fontSize="md">
          {userData.lastInterview}
        </Text>
      </VStack>

      <Divider my={4} />

      <VStack align="start" spacing={4} mt={5}>
        <Text fontSize="lg" fontWeight="bold">
          Pending interviews:
        </Text>
        {userData.nextInterviews.map((interview, index) => (
          <HStack key={index} spacing={3}>
            <Text fontSize="md">{interview.date}</Text>
            <Badge colorScheme="blue">{interview.tech}</Badge>
          </HStack>
        ))}
      </VStack>
    </Container>
  )
}


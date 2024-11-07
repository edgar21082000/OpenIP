import { createFileRoute } from '@tanstack/react-router'

import { Container, Image } from "@chakra-ui/react"
import Logo from "/assets/images/fastapi-logo.svg"

type MyPageProps = {
  children: React.ReactNode
}

export const MyPage: React.FC<MyPageProps> = ({ children }) => {
  return (
    <Container
      as="form"
      h="100vh"
      maxW="sm"
      alignItems="stretch"
      justifyContent="center"
      gap={4}
      centerContent
    >
      <Image
        src={Logo}
        alt="FastAPI logo"
        height="auto"
        maxW="2xs"
        alignSelf="center"
        mb={4}
      />
      {children}
    </Container>
  )
}

export const Route = createFileRoute('/mypage')({
  component: MyPage,
})
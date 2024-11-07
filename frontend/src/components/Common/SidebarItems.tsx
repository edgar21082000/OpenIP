import { Box, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react"
import { useQueryClient } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { FiTrello, FiUser, FiSettings, FiUsers, FiAward  } from "react-icons/fi"

import type { UserPublic } from "../../client"
import { IconType } from "react-icons/lib"

const adminitems = [
  { icon: FiUser, title: "Profile", path: "/" },
  { icon: FiTrello, title: "Interviews", path: "/items" },
  { icon: FiAward, title: "Score board", path: "/scoreboard" },
  { icon: FiSettings, title: "Settings", path: "/settings" },
  { icon: FiUsers, title: "Admin", path: "/admin" }
]

const hritems = [
  { icon: FiUser, title: "Profile", path: "/" },
  { icon: FiAward, title: "Score board", path: "/scoreboard" },
  { icon: FiSettings, title: "Settings", path: "/settings" },
]

const applicantitems = [
  { icon: FiUser, title: "Profile", path: "/" },
  { icon: FiTrello, title: "Interviews", path: "/items" },
  { icon: FiSettings, title: "Settings", path: "/settings" },
]

const intervieweritems = [
  { icon: FiUser, title: "Profile", path: "/" },
  { icon: FiTrello, title: "Interviews", path: "/items" },
  { icon: FiSettings, title: "Settings", path: "/settings" },
]

interface SidebarItemsProps {
  onClose?: () => void
}

const SidebarItems = ({ onClose }: SidebarItemsProps) => {
  const queryClient = useQueryClient()
  const textColor = useColorModeValue("ui.main", "ui.light")
  const bgActive = useColorModeValue("#E2E8F0", "#4A5568")
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"])

  let items: { icon: IconType, title: string, path: string}[] = [];
  if (currentUser?.is_superuser)
    items = adminitems;
  else if (currentUser?.role == 'HR')
    items = hritems;
  else if (currentUser?.role == 'applicant')
    items = applicantitems;
  else if (currentUser?.role == 'interviewer')
    items = intervieweritems;
  
  currentUser?.is_superuser
    ? [...items, { icon: FiUsers, title: "Admin", path: "/admin" }]
    : items

  const listItems = items.map(({ icon, title, path }) => (
    <Flex
      as={Link}
      to={path}
      w="100%"
      p={2}
      key={title}
      activeProps={{
        style: {
          background: bgActive,
          borderRadius: "12px",
        },
      }}
      color={textColor}
      onClick={onClose}
    >
      <Icon as={icon} alignSelf="center" />
      <Text ml={2}>{title}</Text>
    </Flex>
  ))

  return (
    <>
      <Box>{listItems}</Box>
    </>
  )
}

export default SidebarItems

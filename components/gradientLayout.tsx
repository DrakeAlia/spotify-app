import { Box, Flex, Text } from '@chakra-ui/layout'
import { Image } from '@chakra-ui/react'

// This component adds a gradient styling layout and format to the home page

// Because it's a layout, it's going to take some props
const GradientLayout = ({
  color,
  children,
  image,
  subtitle,
  title,
  description,
  roundImage,
}) => {
  // JSX - return a full page box
  return (
    <Box
      height="100%"
      // overflowY - for scrolling
      overflowY="auto"
      // Linear gradient starting at whatever color they pass in as a prop
      // With charka we can do colors .100 to .900
      // Our gradient gets darker as it moves down to the bottom(until it fades to black - rgba)
      bgGradient={`linear(${color}.500 0%, ${color}.600 15%, ${color}.700 40%, rgba(0,0,0,0.95) 75%)`}
    >
      {/* profile image container */}
      <Flex bg={`${color}.600`} padding="40px" align="end">
        <Box padding="20px">
          <Image
            boxSize="160px"
            boxShadow="2xl"
            src={image}
            borderRadius={roundImage ? '100%' : '3px'}
          />
        </Box>
        {/* profile text/content container */}
        <Box padding="20px" lineHeight="40px" color="white">
          {/* text component abstracts away from having to ever use h1-h6, p tags, or span tags */}
          <Text fontSize="x-small" fontWeight="bold" casing="uppercase">
            {subtitle}
          </Text>
          <Text fontSize="6xl">{title}</Text>
          <Text fontSize="x-small">{description}</Text>
        </Box>
      </Flex>
      <Box paddingY="50px">{children}</Box>
    </Box>
  )
}

export default GradientLayout

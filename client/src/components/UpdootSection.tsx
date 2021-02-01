import { Flex, IconButton } from '@chakra-ui/react';
import React from 'react'

interface UpdootSectionProps {

}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ }) => {
    return (
        <Flex direction='column' mr={4} justifyContent='center' alignItems='center'>
            <IconButton aria-label='updoot post' name='chevron-up' size='24px' />
            {p.points}
            <IconButton aria-label='downdoot post' name='chevron-down' size='24px' />
        </Flex>
    );
}
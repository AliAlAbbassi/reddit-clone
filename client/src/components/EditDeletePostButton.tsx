import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, IconButton, Link } from '@chakra-ui/react';
import React from 'react'
import NextLink from 'next/link'
import { useDeletePostMutation, useMeQuery } from '../generated/graphql';

interface EditDeletePostButtonProps {
    id: number
    creatorId: number
}

export const EditDeletePostButton: React.FC<EditDeletePostButtonProps> = ({ id, creatorId }) => {
    const [{ data: meData }] = useMeQuery()
    const [, deletePost] = useDeletePostMutation()

    if (meData?.me?.id !== creatorId) {
        return null
    }
    return (
        <Box ml='auto'>
            <NextLink
                href='/post/edit/[id'
                as={`/post/edit/${id}`}>
                <IconButton
                    as={Link}
                    mr={4}
                    icon={<EditIcon />}
                    aria-label='Edit Post' />
            </NextLink>
            <IconButton
                ml='auto'
                icon={<DeleteIcon />}
                onClick={() => {
                    deletePost({ id })
                }}
                aria-label='Delete Post' />
        </Box>
    );
}
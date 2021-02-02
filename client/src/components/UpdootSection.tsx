import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Flex, IconButton } from '@chakra-ui/react';
import React, { useState } from 'react'
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';

interface UpdootSectionProps {
    post: PostSnippetFragment
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
    const [loadingState, setLoadingState] = useState<'updoot-loading' | 'downdoot-loading' | 'not-loading'>('not-loading')
    const [{ fetching }, vote] = useVoteMutation()
    return (
        <Flex direction='column' mr={4} justifyContent='center' alignItems='center'>
            <IconButton
                onClick={() => {
                    if (post.voteStatus === 1) {
                        return
                    }
                    setLoadingState('updoot-loading')
                    vote({
                        postId: post.id,
                        value: 1
                    })
                    setLoadingState('not-loading')
                }}
                colorScheme={post.voteStatus === 1 ? 'green' : undefined}
                isLoading={loadingState === 'updoot-loading'}
                aria-label='updoot post'
                icon={<ChevronUpIcon />}
                size='sm'
            />
            {post.points}
            <IconButton
                onClick={async () => {
                    if (post.voteStatus === -1) {
                        return
                    }
                    setLoadingState('downdoot-loading')
                    await vote({
                        postId: post.id,
                        value: -1
                    })
                    setLoadingState('not-loading')
                }}
                isLoading={loadingState === 'downdoot-loading'}
                colorScheme={post.voteStatus === -1 ? 'red' : undefined}
                aria-label='downdoot post'
                icon={<ChevronDownIcon />}
                size='sm' />
        </Flex>
    );
}
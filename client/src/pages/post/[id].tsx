import { Box, Heading } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import { EditDeletePostButton } from '../../components/EditDeletePostButton';
import { Layout } from '../../components/Layout';
import { createUrqlClient } from '../../Utils/createUrqlClient';
import { useGetPostFromUrl } from '../../Utils/useGetPostFromUrl';

const Post = ({ }) => {
    const [{ data, error, fetching }] = useGetPostFromUrl()
    if (fetching) {
        return (
            <Layout>
                <div>loading...</div>
            </Layout>
        )
    }

    if (!data?.post) {
        return (
            <Layout>No post found</Layout>
        )
    }
    return (
        <Layout>
            <Heading mb={4}>{data.post.title}</Heading>
            {data.post.text}
            <Box mb={4}>
                <EditDeletePostButton id={data.post?.id} creatorId={data.post.creatorId} />
            </Box>
        </Layout>
    );
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Post)
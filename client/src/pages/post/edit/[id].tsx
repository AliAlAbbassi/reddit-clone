import { Box, Button, Flex } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { Router, useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../../../components/InputField';
import { Layout } from '../../../components/Layout';
import { usePostQuery, useUpdatePostMutation } from '../../../generated/graphql';
import { createUrqlClient } from '../../../Utils/createUrqlClient';
import { useGetIntId } from '../../../Utils/useGetIntId';

const EditPost = ({ }) => {
    const router = useRouter()
    const intId = useGetIntId()
    const [{ data, fetching }] = usePostQuery({
        pause: intId === -1,
        variables: {
            id: intId,
        },
    })
    const [, updatePost] = useUpdatePostMutation()
    if (fetching) {
        return (
            <Layout>
                <div>Loading...</div>
            </Layout>
        )
    }
    if (!data?.post) {
        return (
            <Layout>No post found</Layout>
        )
    }
    return (
        <Layout variant='small'>
            <Formik
                initialValues={{ title: data.post.title, text: data.post.text }}
                onSubmit={async (values) => {
                    await updatePost({ id: intId, ...values })
                    router.back()
                }}>
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name='title'
                            placeholder='title'
                            label='Title' />
                        <Box mt={4}>
                            <InputField
                                name='text'
                                placeholder='text...'
                                label='Body'
                                textarea
                                type='text' />
                        </Box>
                        <Flex>
                            <Button
                                mt={4}
                                colorScheme='teal'
                                isLoading={isSubmitting}
                                type='submit'>Update Post</Button>
                        </Flex>
                    </Form>
                )}
            </Formik>
        </Layout>
    );
}

export default withUrqlClient(createUrqlClient)(EditPost)
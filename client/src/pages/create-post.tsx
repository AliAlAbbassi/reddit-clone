import { Box, Button, Flex } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { InputField } from '../components/InputField';
import { Layout } from '../components/Layout';
import { Wrapper } from '../components/Wrapper';
import { useCreatePostMutation, useMeQuery } from '../generated/graphql';
import { createUrqlClient } from '../Utils/createUrqlClient';
import { useIsAuth } from '../Utils/useIsAuth';

const createPost: React.FC<{}> = ({ }) => {
    const router = useRouter()
    useIsAuth()
    const [, createPost] = useCreatePostMutation()

    return (
        <Layout variant='small'>
            <Formik
                initialValues={{ title: '', text: '' }}
                onSubmit={async (values) => {
                    const { error } = await createPost({ input: values })
                    if (!error) {
                        router.push('/')
                    }
                    router.push('/')
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
                                type='submit'>Create Post</Button>
                        </Flex>
                    </Form>
                )}
            </Formik>
        </Layout>
    );
}

export default withUrqlClient(createUrqlClient)(createPost)
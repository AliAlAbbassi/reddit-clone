import React from 'react'
import { Form, Formik } from 'formik'
import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../Utils/toErrorMap';
import { useRouter } from 'next/router'
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../Utils/createUrqlClient';
import NextLink from 'next/link'
import { query } from '@urql/exchange-graphcache';

const Login: React.FC<{}> = ({ }) => {
    const [, login] = useLoginMutation()
    const router = useRouter()
    return (
        <Wrapper variant='small'>
            <Formik
                initialValues={{ usernameOrEmail: '', password: '' }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await login(values)
                    if (response.data?.login.errors) {
                        setErrors(toErrorMap(response.data.login.errors))
                    } else if (response.data?.login.user) {
                        if (typeof router.query.next === 'string') {
                            router.push(router.query.next)
                        } else {
                            // worked
                            router.push('/')
                        }
                    }
                }}>
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name='usernameOrEmail'
                            placeholder='username or email'
                            label='Username Or Email' />
                        <Box mt={4}>
                            <InputField name='password' placeholder='password' label='Password' type='password' />
                        </Box>
                        <Flex>
                            <Button
                                mt={4}
                                colorScheme='teal'
                                isLoading={isSubmitting}
                                type='submit'>Login</Button>
                            <NextLink href='/forgot-password'>
                                <Link mt={2} ml={'auto'}>forgot password?</Link>
                            </NextLink>
                        </Flex>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}

export default withUrqlClient(createUrqlClient)(Login) 
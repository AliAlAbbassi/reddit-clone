import { Box, Flex, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import router from 'next/dist/next-server/lib/router/router';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useForgotPasswordMutation } from '../generated/graphql';
import { createUrqlClient } from '../Utils/createUrqlClient';
import { toErrorMap } from '../Utils/toErrorMap';
import login from './login';


const ForgotPassword: React.FC<{}> = ({ }) => {
    const [complete, setComplete] = useState(false)
    const [, forgotPassword] = useForgotPasswordMutation()
    const router = useRouter()
    return (
        <Wrapper variant='small'>
            <Formik
                initialValues={{ email: '' }}
                onSubmit={async (values) => {
                    await forgotPassword(values)
                    setComplete(true)
                }}>
                {({ isSubmitting }) => complete ? (<Box>if an account with that email exists, we sent you an email</Box>) : (
                    <Form>
                        <InputField
                            name='email'
                            placeholder='email'
                            label='Email' />
                        <Button
                            mt={4}
                            colorScheme='teal'
                            isLoading={isSubmitting}
                            type='submit'>forgot pass</Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}

export default withUrqlClient(createUrqlClient)(ForgotPassword)
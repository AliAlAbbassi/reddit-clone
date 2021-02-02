export interface AppRenderProps {
  pageProps: object
  err?: Error
  Component: NextComponentType<NextPageContext, AppRenderProps, object>
  router: NextRouter
}
import type { NextComponentType, NextPageContext } from "next"
import type { NextRouter } from "next/router"
import { Chakra } from "../Chakra"

export default function MyApp({ Component, pageProps }: AppRenderProps) {
  return (
    <Chakra>
      <Component {...pageProps} />
    </Chakra>
  )
}
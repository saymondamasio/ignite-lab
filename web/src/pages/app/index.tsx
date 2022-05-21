import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0'
import Link from 'next/link'
import { useMeQuery } from '../../graphql/generated/graphql'
import { ssrGetProducts } from '../../graphql/generated/page'
import { getServerPageGetProducts } from '../../graphql/generated/pagePublic'
import { withApollo } from '../../lib/withApollo'

function Home({ data }) {
  const { user } = useUser()
  const { data: meData, loading, error } = useMeQuery()

  return (
    <div className="text-violet-500">
      <pre>{JSON.stringify(meData, null, 2)}</pre>
      <pre>{JSON.stringify(user, null, 2)}</pre>

      <pre>{JSON.stringify(data, null, 2)}</pre>

      <Link href="/api/auth/logout">Logout</Link>
    </div>
  )
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async ctx => {
    return {
      props: {},
    }
  },
})

export default withApollo(ssrGetProducts.withPage()(Home))

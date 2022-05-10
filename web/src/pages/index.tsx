import { getAccessToken, getSession } from "@auth0/nextjs-auth0"
import { GetServerSideProps } from "next"
import Link from "next/link"

export default function Home() {
  return null
}


export const  getServerSideProps: GetServerSideProps = async ({req, res}) => {
  const session = getSession(req, res)

   const { accessToken } = await getAccessToken(req, res)
  console.log(accessToken);
  

  if(!session) {
    return {
      redirect: {
        destination: '/api/auth/login',
        permanent: false 
      }
    }
  } else {
    return {
        redirect: {
        destination: '/app',
        permanent: false 
      }
    }
  }
}
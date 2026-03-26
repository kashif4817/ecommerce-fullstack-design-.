import UnlockClient from './UnlockClient'

export const metadata = { title: 'Unlock Admin' }

export default async function AdminUnlockPage({ searchParams }) {
  const nextPath = searchParams?.next || '/admin'

  return <UnlockClient nextPath={nextPath} />
}

import { createAdminClient } from '@/utils/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createAdminClient()

  const { data: { users }, error } = await supabase.auth.admin.listUsers()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Transform data to match our UI expectations
  const transformedUsers = users.map(user => ({
    id: user.id,
    name: user.user_metadata.full_name || user.email?.split('@')[0],
    email: user.email,
    rank: '과장', // Default for now, could be in metadata
    status: user.last_sign_in_at ? 'ACTIVE' : 'INACTIVE',
    last_sign_in: user.last_sign_in_at,
    verified: !!user.email_confirmed_at
  }))

  return NextResponse.json({ users: transformedUsers })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { error } = await supabase.auth.admin.deleteUser(id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

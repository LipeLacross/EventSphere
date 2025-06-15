export default defineNuxtRouteMiddleware(async (to) => {
  try {
    if (!to.path.startsWith('/admin')) return

    // Bypass para desenvolvimento (remova em produção)
    if (process.dev) {
      console.warn('[DEV MODE] Acesso administrativo liberado')
      return true
    }

    const supabase = useSupabaseClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) return navigateTo('/login')

    if (!user.email?.endsWith('@admin.com')) {
      await supabase.auth.signOut()
      throw createError({
        statusCode: 403,
        message: 'Acesso restrito a administradores'
      })
    }

    return true

  } catch (err: any) {
    console.error('Erro no middleware de admin:', err)
    if (err.statusCode === 403) throw err
    return navigateTo('/login')
  }
})
